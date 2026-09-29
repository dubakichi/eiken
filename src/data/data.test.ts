import { describe, expect, it } from 'vitest'
import { TAG_LABELS, WORD_POS_LABELS } from '../types'
import { BLANK } from '../lib/speech'
import { questions, words } from './index'

describe('問題データ', () => {
  it('id が重複していない', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(questions.map((q) => [q.id, q] as const))('%s の形式が正しい', (_, q) => {
    expect(q.choices).toHaveLength(4)
    expect(new Set(q.choices).size).toBe(4)
    expect(q.choices).toContain(q.answer)
    const blanks = q.lines.map((l) => l.text.split(BLANK).length - 1)
    expect(blanks.reduce((a, b) => a + b, 0)).toBe(1)
    expect(q.tags.length).toBeGreaterThan(0)
    for (const tag of q.tags) expect(TAG_LABELS).toHaveProperty(tag)
    expect(q.ja).not.toBe('')
    expect(q.explanation).not.toBe('')
  })
})

describe('単語データ', () => {
  it('id・英語・日本語が重複していない', () => {
    for (const key of ['id', 'en', 'ja'] as const) {
      const values = words.map((w) => w[key])
      expect(new Set(values).size, key).toBe(values.length)
    }
  })

  it('カタカナ読みがカタカナだけで書かれている', () => {
    for (const w of words) expect(w.kana, w.en).toMatch(/^[ァ-ヶー]+( [ァ-ヶー]+)*$/)
  })

  it('品詞が正しく、どの品詞も4択を作れるだけある', () => {
    for (const w of words) expect(WORD_POS_LABELS).toHaveProperty(w.pos)
    for (const pos of Object.keys(WORD_POS_LABELS)) {
      expect(words.filter((w) => w.pos === pos).length, pos).toBeGreaterThanOrEqual(4)
    }
  })
})
