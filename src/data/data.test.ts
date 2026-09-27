import { describe, expect, it } from 'vitest'
import { TAG_LABELS } from '../types'
import { BLANK } from '../lib/speech'
import { questions } from './index'

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
