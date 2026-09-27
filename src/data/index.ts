import type { FillBlankQuestion, Word } from '../types'
import grammarVocab from './grammar-vocab.json'
import wordList from './words.json'

export const questions: FillBlankQuestion[] = (
  grammarVocab as Omit<FillBlankQuestion, 'kind'>[]
).map((q) => ({ ...q, kind: 'fill-blank' }))

export const words = wordList as Word[]
