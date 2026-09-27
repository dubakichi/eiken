import { describe, expect, it } from 'vitest'
import { pickVoices, rankVoices, type VoiceInfo } from './voices'

const v = (name: string, lang = 'en-US', localService = true): VoiceInfo => ({
  name,
  lang,
  localService,
})

// この開発機（macOS + Chrome）で実際に返ってきた英語の声の一部
const MAC_CHROME = [
  v('Albert'), v('Bad News'), v('Bubbles'), v('Daniel', 'en-GB'),
  v('Eddy (英語（アメリカ合衆国）)'), v('Fred'), v('Grandma (英語（アメリカ合衆国）)'),
  v('Karen', 'en-AU'), v('Samantha'), v('Zarvox'), v('ささやき声'), v('トリノイド'),
  v('こんにちは', 'ja-JP'),
]

describe('rankVoices', () => {
  it('ネタ用の声と英語以外の声を除く', () => {
    const names = rankVoices(MAC_CHROME).map((x) => x.name)
    for (const bad of ['Albert', 'Bad News', 'Bubbles', 'Fred', 'Zarvox', 'ささやき声', 'こんにちは']) {
      expect(names).not.toContain(bad)
    }
    expect(names[0]).toBe('Samantha')
  })

  it('Premium / Natural の声をいちばん上にする', () => {
    const ranked = rankVoices([
      v('Samantha'),
      v('Microsoft Aria Online (Natural) - English (United States)', 'en-US', false),
      v('Ava (Premium)'),
    ])
    expect(ranked[2].name).toBe('Samantha')
  })

  it('機械的な Eloquence の声は下のほう', () => {
    const names = rankVoices(MAC_CHROME).map((x) => x.name)
    expect(names.at(-1)).toBe('Eddy (英語（アメリカ合衆国）)')
  })
})

describe('pickVoices', () => {
  it('B 役は A 役と性別がちがう声にする', () => {
    const { a, b } = pickVoices(rankVoices(MAC_CHROME))
    expect(a?.name).toBe('Samantha')
    expect(b?.name).toBe('Daniel')
  })

  it('指定した声を A 役にする', () => {
    const { a, b } = pickVoices(rankVoices(MAC_CHROME), 'Daniel')
    expect(a?.name).toBe('Daniel')
    expect(b?.name).toBe('Samantha')
  })

  it('声が1つしかなければ A と B は同じ', () => {
    const { a, b } = pickVoices([v('Samantha')])
    expect(a).toBe(b)
  })

  it('声がなければどちらも undefined', () => {
    expect(pickVoices([])).toEqual({})
  })
})
