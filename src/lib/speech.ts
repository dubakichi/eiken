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

if (isSupported()) {
  refreshVoices()
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
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
  const synth = window.speechSynthesis
  synth.cancel()
  const { a, b } = pickVoices(voices, settings.voiceName)
  for (const line of lines) {
    const text = answer ? fillBlank(line.text, answer) : line.text.replace(BLANK, ', ... ,')
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = line.speaker === 'B' ? b : a
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'en-US'
    utterance.rate = settings.rate
    synth.speak(utterance)
  }
}

export function stopSpeaking(): void {
  if (isSupported()) window.speechSynthesis.cancel()
}
