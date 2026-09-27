import { questions, words } from '../data'
import type { FillBlankQuestion, WordPrompt } from '../types'
import type { SessionMode } from './session'
import { wordPrompts } from './words'

/** ホーム画面から選ぶコース */
export type Course = 'grammar' | 'words' | 'weak'

type PoolItem = FillBlankQuestion | WordPrompt

const grammarPool: PoolItem[] = questions
const wordPool: PoolItem[] = wordPrompts(words)

/** にがてノートは、文の問題と単語の問題をまぜて出す */
export function poolFor(course: Course): PoolItem[] {
  if (course === 'grammar') return grammarPool
  if (course === 'words') return wordPool
  return [...grammarPool, ...wordPool]
}

export function sessionMode(course: Course): SessionMode {
  return course === 'weak' ? 'weak' : 'practice'
}

export const COURSE_SIZES = { grammar: grammarPool.length, words: wordPool.length }
