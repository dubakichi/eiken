import type { FillBlankQuestion, Progress } from '../types'
import { weakIds } from './progress'

export const SESSION_SIZE = 10

export type SessionMode = 'practice' | 'weak'

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 1回分の出題を選ぶ。
 * practice: ①復習日が来た問題（覚えていない順）→ ②まだ解いていない問題 → ③残りを box の小さい順
 * weak: にがてノートの問題だけ（覚えていない順）
 */
export function buildSession<T extends { id: string }>(
  questions: readonly T[],
  progress: Progress,
  today: string,
  mode: SessionMode,
  size: number = SESSION_SIZE,
  rng: () => number = Math.random,
): T[] {
  const { records } = progress
  const byBox = (a: T, b: T) =>
    records[a.id].box - records[b.id].box

  if (mode === 'weak') {
    const weak = new Set(weakIds(progress))
    const pool = shuffle(questions.filter((q) => weak.has(q.id)), rng)
    return pool.sort(byBox).slice(0, size)
  }

  const seen = questions.filter((q) => records[q.id])
  const due = shuffle(seen.filter((q) => records[q.id].due <= today), rng).sort(byBox)
  const fresh = shuffle(questions.filter((q) => !records[q.id]), rng)
  const notDue = shuffle(seen.filter((q) => records[q.id].due > today), rng).sort(byBox)

  return [...due, ...fresh, ...notDue].slice(0, size)
}

/** 選択肢の順番を毎回まぜて、位置で答えを覚えてしまうのを防ぐ */
export function withShuffledChoices(
  question: FillBlankQuestion,
  rng: () => number = Math.random,
): FillBlankQuestion {
  return { ...question, choices: shuffle(question.choices, rng) }
}
