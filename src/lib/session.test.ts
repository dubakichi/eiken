import { describe, expect, it } from 'vitest'
import type { FillBlankQuestion, Progress } from '../types'
import { emptyProgress } from './progress'
import { buildSession, withShuffledChoices } from './session'

const TODAY = '2026-09-27'

function q(id: string): FillBlankQuestion {
  return {
    kind: 'fill-blank',
    id,
    tags: ['noun'],
    lines: [{ text: 'a ___' }],
    choices: ['a', 'b', 'c', 'd'],
    answer: 'a',
    ja: '',
    explanation: '',
  }
}

const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].map(q)

function progressWith(records: Progress['records']): Progress {
  return { ...emptyProgress(), records }
}

describe('buildSession (practice)', () => {
  it('復習日が来た問題 → 新しい問題 → 復習日前の問題 の順に選ぶ', () => {
    const p = progressWith({
      q1: { box: 3, due: '2026-10-01', seen: 2, wrong: 0, lastCorrect: true },
      q2: { box: 2, due: TODAY, seen: 1, wrong: 0, lastCorrect: true },
      q3: { box: 1, due: '2026-09-26', seen: 1, wrong: 1, lastCorrect: false },
    })
    const ids = buildSession(questions, p, TODAY, 'practice', 6).map((x) => x.id)
    expect(ids.slice(0, 2)).toEqual(['q3', 'q2'])
    expect(ids.slice(2, 5).sort()).toEqual(['q4', 'q5', 'q6'])
    expect(ids[5]).toBe('q1')
  })

  it('指定した問題数で打ち切る', () => {
    expect(buildSession(questions, emptyProgress(), TODAY, 'practice', 4)).toHaveLength(4)
  })
})

describe('buildSession (weak)', () => {
  it('にがての問題だけを出す', () => {
    const p = progressWith({
      q1: { box: 1, due: '2026-10-01', seen: 1, wrong: 1, lastCorrect: false },
      q2: { box: 4, due: TODAY, seen: 4, wrong: 1, lastCorrect: true },
      q3: { box: 2, due: TODAY, seen: 1, wrong: 0, lastCorrect: true },
    })
    expect(buildSession(questions, p, TODAY, 'weak').map((x) => x.id)).toEqual(['q1'])
  })
})

describe('withShuffledChoices', () => {
  it('選択肢の中身と答えは変わらない', () => {
    const shuffled = withShuffledChoices(q('x'), () => 0)
    expect([...shuffled.choices].sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(shuffled.answer).toBe('a')
  })
})
