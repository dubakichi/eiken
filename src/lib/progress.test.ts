import { describe, expect, it } from 'vitest'
import {
  addDays,
  emptyProgress,
  recordAnswer,
  streakDays,
  updateRecord,
  weakIds,
} from './progress'

const TODAY = '2026-09-27'

describe('addDays', () => {
  it('月末・年末をまたいで計算できる', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('updateRecord', () => {
  it('はじめて正解したら box 2 になり、2日後に再出題', () => {
    const r = updateRecord(undefined, true, TODAY)
    expect(r).toEqual({ box: 2, due: '2026-09-29', seen: 1, wrong: 0, lastCorrect: true })
  })

  it('間違えたら box 1 に戻り、あした再出題', () => {
    const prev = { box: 4, due: TODAY, seen: 3, wrong: 0, lastCorrect: true }
    const r = updateRecord(prev, false, TODAY)
    expect(r).toEqual({ box: 1, due: '2026-09-28', seen: 4, wrong: 1, lastCorrect: false })
  })

  it('box は 5 より大きくならない', () => {
    const prev = { box: 5, due: TODAY, seen: 5, wrong: 0, lastCorrect: true }
    const r = updateRecord(prev, true, TODAY)
    expect(r.box).toBe(5)
    expect(r.due).toBe('2026-10-11')
  })
})

describe('recordAnswer', () => {
  it('記録と、その日の解答数を更新する', () => {
    let p = recordAnswer(emptyProgress(), 'q1', true, TODAY)
    p = recordAnswer(p, 'q2', false, TODAY)
    expect(p.daily[TODAY]).toBe(2)
    expect(p.records.q1.box).toBe(2)
    expect(p.records.q2.box).toBe(1)
  })
})

describe('weakIds', () => {
  it('間違えたことがあり、まだ box 2 以下の問題だけを返す', () => {
    let p = emptyProgress()
    p = recordAnswer(p, 'wrong-once', false, TODAY)
    p = recordAnswer(p, 'correct', true, TODAY)
    p = recordAnswer(p, 'recovered', false, TODAY)
    p = recordAnswer(p, 'recovered', true, TODAY)
    p = recordAnswer(p, 'recovered', true, TODAY)
    expect(weakIds(p).sort()).toEqual(['wrong-once'])
  })
})

describe('streakDays', () => {
  it('きょうまでの連続日数を数える', () => {
    const p = { ...emptyProgress(), daily: { '2026-09-25': 3, '2026-09-26': 5, [TODAY]: 1 } }
    expect(streakDays(p, TODAY)).toBe(3)
  })

  it('きょうまだ解いていなければ、きのうまでを数える', () => {
    const p = { ...emptyProgress(), daily: { '2026-09-25': 3, '2026-09-26': 5 } }
    expect(streakDays(p, TODAY)).toBe(2)
  })

  it('とぎれていたら 0', () => {
    const p = { ...emptyProgress(), daily: { '2026-09-20': 3 } }
    expect(streakDays(p, TODAY)).toBe(0)
  })
})
