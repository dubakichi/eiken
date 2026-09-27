import type { Progress, QuestionRecord } from '../types'

const STORAGE_KEY = 'eiken4:progress:v1'

/** box ごとに、正解したあと何日あけて再出題するか */
const INTERVAL_DAYS: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 }
export const MAX_BOX = 5

export function emptyProgress(): Progress {
  return { records: {}, daily: {}, settings: { rate: 0.85 } }
}

/** ローカル時刻での YYYY-MM-DD */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return toDateKey(new Date(y, m - 1, d + days))
}

/**
 * 1問の解答結果を記録に反映する。
 * 正解: 1つ上の box へ（初めての正解は box 2 から）。間違い: box 1 に戻し、あした再出題。
 */
export function updateRecord(
  prev: QuestionRecord | undefined,
  correct: boolean,
  today: string,
): QuestionRecord {
  const seen = (prev?.seen ?? 0) + 1
  const wrong = (prev?.wrong ?? 0) + (correct ? 0 : 1)
  if (!correct) {
    return { box: 1, due: addDays(today, 1), seen, wrong, lastCorrect: false }
  }
  const box = Math.min((prev?.box ?? 1) + 1, MAX_BOX)
  return { box, due: addDays(today, INTERVAL_DAYS[box]), seen, wrong, lastCorrect: true }
}

export function recordAnswer(
  progress: Progress,
  questionId: string,
  correct: boolean,
  today: string,
): Progress {
  return {
    ...progress,
    records: {
      ...progress.records,
      [questionId]: updateRecord(progress.records[questionId], correct, today),
    },
    daily: { ...progress.daily, [today]: (progress.daily[today] ?? 0) + 1 },
  }
}

/** まだ覚えきれていない（間違えたことがあり box 2 以下）問題の id */
export function weakIds(progress: Progress): string[] {
  return Object.entries(progress.records)
    .filter(([, r]) => r.wrong > 0 && r.box <= 2)
    .map(([id]) => id)
}

/** きょう（まだ解いていなければきのう）までの連続学習日数 */
export function streakDays(progress: Progress, today: string): number {
  let day = (progress.daily[today] ?? 0) > 0 ? today : addDays(today, -1)
  let count = 0
  while ((progress.daily[day] ?? 0) > 0) {
    count++
    day = addDays(day, -1)
  }
  return count
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Partial<Progress>
    const base = emptyProgress()
    return {
      records: parsed.records ?? base.records,
      daily: parsed.daily ?? base.daily,
      settings: { ...base.settings, ...parsed.settings },
    }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // 保存できない環境（プライベートモード等）では記録なしで続ける
  }
}
