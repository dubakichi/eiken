import type { Line, Settings } from '../types'
import { pickVoices, rankVoices } from './voices'

export const BLANK = '___'

export function fillBlank(text: string, word: string): string {
  return text.replace(BLANK, word)
}

let voices: SpeechSynthesisVoice[] = []
const listeners = new Set<() => void>()

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function refreshVoices(): void {
  voices = rankVoices(window.speechSynthesis.getVoices())
  listeners.forEach((listener) => listener())
}

/** 読み上げが始まらないとみなすまでの時間 */
const START_TIMEOUT_MS = 2000

/** 今の読み上げの番号。新しく読み上げたら、前の見張りを無効にするのに使う */
let generation = 0
/**
 * 読み上げ中の発話を持っておく。Chrome では参照がなくなると
 * ガベージコレクションで start / end イベントが来なくなることがある。
 */
let active: SpeechSynthesisUtterance[] = []

if (isSupported()) {
  refreshVoices()
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
  // 前のページが読み上げの途中で閉じられると、Chrome の読み上げが固まることがあるので、
  // 開いたときと離れるときに片付ける
  window.speechSynthesis.cancel()
  window.addEventListener('pagehide', () => window.speechSynthesis.cancel())
}

/** 使える英語の声の名前（聞きやすい順） */
export function voiceNames(): string[] {
  return voices.map((v) => v.name)
}

/** 声のリストが読みこまれたら呼ばれる。戻り値で購読を解除する */
export function onVoicesChanged(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * 行を順番に読み上げる。answer を渡すと空所に入れて読み、
 * 渡さなければ空所は少し間をあけて読む。会話は A と B で声を変える。
 */
export function speakLines(lines: Line[], settings: Settings, answer?: string): void {
  if (!isSupported()) return
  const texts = lines.map((line) => ({
    speaker: line.speaker,
    text: answer ? fillBlank(line.text, answer) : line.text.replace(BLANK, ', ... ,'),
  }))
  const current = ++generation
  speakTexts(texts, settings, current)

  // Chrome の読み上げが一時停止や順番待ちのまま固まると、音が出ないまま何も起きない。
  // 決まった時間内に始まらなければ、いちどリセットして1回だけやり直す。
  const first = active[0]
  if (!first) return
  let started = false
  first.addEventListener('start', () => (started = true))
  first.addEventListener('error', () => (started = true))
  setTimeout(() => {
    if (started || current !== generation) return
    const synth = window.speechSynthesis
    synth.cancel()
    synth.resume()
    speakTexts(texts, settings, current)
  }, START_TIMEOUT_MS)
}

function speakTexts(
  texts: { speaker?: Line['speaker']; text: string }[],
  settings: Settings,
  current: number,
): void {
  const synth = window.speechSynthesis
  if (synth.speaking || synth.pending) synth.cancel()
  if (synth.paused) synth.resume()
  const { a, b } = pickVoices(voices, settings.voiceName)
  active = texts.map(({ speaker, text }) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = speaker === 'B' ? b : a
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'en-US'
    utterance.rate = settings.rate
    utterance.addEventListener('end', () => {
      if (current === generation && utterance === active.at(-1)) active = []
    })
    return utterance
  })
  active.forEach((utterance) => synth.speak(utterance))
}

export function stopSpeaking(): void {
  if (!isSupported()) return
  generation++
  active = []
  window.speechSynthesis.cancel()
}
