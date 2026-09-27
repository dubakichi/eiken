import type { FillBlankQuestion, QuizItem, Settings, Word, WordPrompt } from '../types'
import { TAG_LABELS, WORD_POS_LABELS } from '../types'
import { withShuffledChoices } from './session'
import { speakLines } from './speech'
import { makeWordQuestion } from './words'

/** 出題の直前に、選択肢をまぜた（単語問題なら選択肢を作った）問題にする */
export function toQuizItem(
  item: FillBlankQuestion | WordPrompt,
  words: readonly Word[],
  rng: () => number = Math.random,
): QuizItem {
  return item.kind === 'word' ? makeWordQuestion(item, words, rng) : withShuffledChoices(item, rng)
}

export function instruction(item: QuizItem): string {
  if (item.kind === 'fill-blank') return '（　）に はいる ことばを えらぼう'
  return item.direction === 'en-ja' ? 'いみを えらぼう' : 'えいごを えらぼう'
}

/** 日→英の問題は、答えるまえに英語を読むと答えがわかってしまうので読まない */
export function canSpeak(item: QuizItem, answered: boolean): boolean {
  return answered || item.kind === 'fill-blank' || item.direction === 'en-ja'
}

export function speakItem(item: QuizItem, settings: Settings, answered: boolean): void {
  if (!canSpeak(item, answered)) return
  if (item.kind === 'fill-blank') {
    speakLines(item.lines, settings, answered ? item.answer : undefined)
  } else {
    speakLines([{ text: item.word.en }], settings)
  }
}

export function tagLabels(item: QuizItem): string[] {
  return item.kind === 'fill-blank'
    ? item.tags.map((t) => TAG_LABELS[t])
    : [WORD_POS_LABELS[item.word.pos]]
}
