import { describe, expect, it } from 'vitest'
import type { Word } from '../types'
import { makeWordQuestion, wordPrompts } from './words'

const words: Word[] = [
  { id: 'w1', en: 'station', kana: 'ステーション', ja: 'えき', pos: 'noun' },
  { id: 'w2', en: 'library', kana: 'ライブラリー', ja: 'としょかん', pos: 'noun' },
  { id: 'w3', en: 'bank', kana: 'バンク', ja: 'ぎんこう', pos: 'noun' },
  { id: 'w4', en: 'museum', kana: 'ミュージアム', ja: 'はくぶつかん', pos: 'noun' },
  { id: 'w5', en: 'run', kana: 'ラン', ja: 'はしる', pos: 'verb' },
  { id: 'w6', en: 'swim', kana: 'スイム', ja: 'およぐ', pos: 'verb' },
]

describe('wordPrompts', () => {
  it('1つの単語から英→日と日→英の2問を作る', () => {
    const ids = wordPrompts(words.slice(0, 1)).map((p) => p.id)
    expect(ids).toEqual(['w1:en-ja', 'w1:ja-en'])
  })
})

describe('makeWordQuestion', () => {
  const [enJa, jaEn] = wordPrompts(words.slice(0, 1))

  it('英→日は日本語の選択肢で、答えを1つふくむ', () => {
    const q = makeWordQuestion(enJa, words)
    expect(q.answer).toBe('えき')
    expect(q.choices).toHaveLength(4)
    expect(q.choices).toContain('えき')
    expect(new Set(q.choices).size).toBe(4)
  })

  it('日→英は英語の選択肢になる', () => {
    const q = makeWordQuestion(jaEn, words)
    expect(q.answer).toBe('station')
    expect(q.choices).toContain('station')
  })

  it('まちがいの選択肢は同じ品詞から選ぶ', () => {
    for (let i = 0; i < 20; i++) {
      const q = makeWordQuestion(jaEn, words)
      expect([...q.choices].sort()).toEqual(['bank', 'library', 'museum', 'station'])
    }
  })

  it('同じ品詞が足りなければ、ほかの品詞からおぎなう', () => {
    const [prompt] = wordPrompts(words.slice(4, 5))
    const q = makeWordQuestion(prompt, words)
    expect(q.choices).toHaveLength(4)
    expect(q.choices).toContain('はしる')
  })
})
