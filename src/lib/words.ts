import type { Word, WordDirection, WordPrompt, WordQuestion } from '../types'
import { shuffle } from './session'

const DIRECTIONS: WordDirection[] = ['en-ja', 'ja-en']

/** 1つの単語から「英→日」と「日→英」の2問を作る */
export function wordPrompts(words: readonly Word[]): WordPrompt[] {
  return words.flatMap((word) =>
    DIRECTIONS.map((direction) => ({
      kind: 'word' as const,
      id: `${word.id}:${direction}`,
      word,
      direction,
    })),
  )
}

/**
 * 選択肢をつくる。まちがいの選択肢は同じ品詞の単語から選ぶ
 * （品詞がそろっていないと、かたちだけで答えがわかってしまうため）。
 */
export function makeWordQuestion(
  prompt: WordPrompt,
  words: readonly Word[],
  rng: () => number = Math.random,
): WordQuestion {
  const { word, direction } = prompt
  const others = words.filter((w) => w.en !== word.en && w.ja !== word.ja)
  const samePos = others.filter((w) => w.pos === word.pos)
  const pool = samePos.length >= 3 ? samePos : others
  const distractors = shuffle(pool, rng).slice(0, 3)
  const label = (w: Word) => (direction === 'en-ja' ? w.ja : w.en)
  return {
    ...prompt,
    choices: shuffle([word, ...distractors].map(label), rng),
    answer: label(word),
  }
}
