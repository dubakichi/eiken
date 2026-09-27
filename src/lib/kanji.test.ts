import { describe, expect, it } from 'vitest'
import { questions, words } from '../data'
import { TAG_LABELS, WORD_POS_LABELS } from '../types'
import { disallowedKanji, GRADE1_KANJI, GRADE2_KANJI } from './kanji'
import { instruction } from './quizItem'
import { makeWordQuestion, wordPrompts } from './words'

/** 保護者向けの文言。子どもが読むものではないので、漢字のルールの対象外 */
const PARENT_FACING = [
  '英語の読み上げ音声が見つかりませんでした。OSの設定で英語の音声を追加してください。',
]

describe('漢字の一覧', () => {
  it('1年生80字・2年生160字で、重複がない', () => {
    expect([...GRADE1_KANJI]).toHaveLength(80)
    expect([...GRADE2_KANJI]).toHaveLength(160)
    expect(new Set([...GRADE1_KANJI, ...GRADE2_KANJI]).size).toBe(240)
  })

  it('習っていない漢字だけを返す', () => {
    expect(disallowedKanji('先生と図書館へ行く')).toEqual(['館'])
    expect(disallowedKanji('ひらがなだけ')).toEqual([])
  })
})

describe('子どもが読む文言は、1・2年生の漢字だけ', () => {
  it.each(questions.map((q) => [q.id, q] as const))('文の問題 %s', (_, q) => {
    expect(disallowedKanji(q.ja), 'ja').toEqual([])
    expect(disallowedKanji(q.explanation), 'explanation').toEqual([])
  })

  it.each(words.map((w) => [`${w.id} ${w.en}`, w] as const))('単語 %s', (_, w) => {
    expect(disallowedKanji(w.ja), 'ja').toEqual([])
    expect(disallowedKanji(w.note ?? ''), 'note').toEqual([])
  })

  it('ラベルと指示文', () => {
    const [enJa, jaEn] = wordPrompts(words.slice(0, 1))
    const texts = [
      ...Object.values(TAG_LABELS),
      ...Object.values(WORD_POS_LABELS),
      instruction(questions[0]),
      instruction(makeWordQuestion(enJa, words)),
      instruction(makeWordQuestion(jaEn, words)),
    ]
    for (const text of texts) expect(disallowedKanji(text), text).toEqual([])
  })

  const sources = import.meta.glob(['../screens/*.tsx', '../components/*.tsx'], {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  it.each(Object.entries(sources))('画面 %s', (_, source) => {
    let text = source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((line) => line.replace(/(^|\s)\/\/.*$/, ''))
      .join('\n')
    for (const phrase of PARENT_FACING) text = text.replaceAll(phrase, '')
    expect(disallowedKanji(text)).toEqual([])
  })
})
