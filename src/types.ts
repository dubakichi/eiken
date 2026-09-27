/** 文の1行。会話なら speaker に "A" / "B" が入る。空所は "___" で表す。 */
export interface Line {
  speaker?: 'A' | 'B'
  text: string
}

/** 筆記1形式（語彙・文法の空所補充4択） */
export interface FillBlankQuestion {
  kind: 'fill-blank'
  id: string
  tags: Tag[]
  lines: Line[]
  choices: string[]
  answer: string
  /** 正しい答えを入れた文の日本語訳 */
  ja: string
  /** 小学生向けの短い解説 */
  explanation: string
}

export type Tag =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'past'
  | 'comparative'
  | 'modal'
  | 'future'
  | 'infinitive'
  | 'question-word'
  | 'idiom'

export const TAG_LABELS: Record<Tag, string> = {
  noun: 'たんご（もの・ばしょ）',
  verb: 'たんご（うごき）',
  adjective: 'たんご（ようす）',
  past: 'むかしのこと（かこけい）',
  comparative: 'くらべる（ひかく）',
  modal: 'can / must など',
  future: 'これからのこと（みらい）',
  infinitive: 'to ～ / ～ing',
  'question-word': 'ぎもんし（What / How など）',
  idiom: 'きまったいいかた',
}

export type WordPos = 'noun' | 'verb' | 'adjective' | 'adverb' | 'past'

export const WORD_POS_LABELS: Record<WordPos, string> = {
  noun: 'たんご（もの・ばしょ・ひと）',
  verb: 'たんご（うごき）',
  adjective: 'たんご（ようす）',
  adverb: 'たんご（いつ・どのくらい）',
  past: 'むかしのかたち（かこけい）',
}

export interface Word {
  id: string
  en: string
  ja: string
  pos: WordPos
  /** 答えたあとに出すひとこと（かこけいのもとの形など） */
  note?: string
}

export type WordDirection = 'en-ja' | 'ja-en'

/** 出題まえの単語問題（選択肢はセッションごとに作る） */
export interface WordPrompt {
  kind: 'word'
  /** 単語 id と向き（例: "w001:en-ja"）。向きごとに学習記録をつける */
  id: string
  word: Word
  direction: WordDirection
}

/** 単語の4択問題（英→日 / 日→英） */
export interface WordQuestion extends WordPrompt {
  choices: string[]
  answer: string
}

export type QuizItem = FillBlankQuestion | WordQuestion

/** 1問ごとの学習記録（Leitner 方式） */
export interface QuestionRecord {
  /** 1〜5。大きいほどよく覚えている */
  box: number
  /** 次に出題してよい日 (YYYY-MM-DD) */
  due: string
  seen: number
  wrong: number
  lastCorrect: boolean
}

export interface Settings {
  /** 読み上げ速度 */
  rate: number
  /** 読み上げに使う声の名前。なければ自動で選ぶ */
  voiceName?: string
}

export interface Progress {
  records: Record<string, QuestionRecord>
  /** 日付 (YYYY-MM-DD) → その日に解いた問題数 */
  daily: Record<string, number>
  settings: Settings
}
