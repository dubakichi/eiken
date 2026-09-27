/** 音声の選び方。SpeechSynthesisVoice に依存しないので単体テストできる */
export interface VoiceInfo {
  name: string
  lang: string
  localService: boolean
}

/** macOS のネタ用・古いロボット声。子どもの学習には向かないので出さない */
const NOVELTY = new Set([
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos', 'Good News',
  'Jester', 'Organ', 'Superstar', 'Trinoids', 'Whisper', 'Wobble', 'Zarvox',
  'Fred', 'Junior', 'Ralph', 'Kathy', 'Grandma', 'Grandpa',
])

/** 古い合成方式で少し機械的な声（ほかに良い声がないときだけ使う） */
const ELOQUENCE = new Set(['Eddy', 'Flo', 'Reed', 'Rocko', 'Sandy', 'Shelley'])

const FEMALE = new Set([
  'Samantha', 'Ava', 'Zoe', 'Allison', 'Susan', 'Joelle', 'Noelle', 'Nicky', 'Karen',
  'Moira', 'Tessa', 'Serena', 'Kate', 'Stephanie', 'Fiona', 'Veena', 'Aria', 'Jenny',
  'Zira', 'Libby', 'Sonia', 'Michelle', 'Emma', 'Female',
])

const MALE = new Set([
  'Tom', 'Evan', 'Nathan', 'Aaron', 'Alex', 'Daniel', 'Oliver', 'Arthur', 'Rishi',
  'Guy', 'David', 'Mark', 'Ryan', 'Christopher', 'Eric', 'Male',
])

function words(name: string): string[] {
  return name.split(/[\s()\-,]+/).filter(Boolean)
}

function baseName(name: string): string {
  return name.split(' (')[0].trim()
}

function gender(name: string): 'female' | 'male' | undefined {
  if (name === 'Google US English') return 'female'
  const w = words(name)
  if (w.some((x) => FEMALE.has(x))) return 'female'
  if (w.some((x) => MALE.has(x))) return 'male'
  return undefined
}

function isNovelty(v: VoiceInfo): boolean {
  // 日本語名だけの声（「ささやき声」など）もネタ用
  return NOVELTY.has(baseName(v.name)) || !/[A-Za-z]/.test(v.name)
}

function score(v: VoiceInfo): number {
  let s = 30
  if (/Premium|Natural|Neural/i.test(v.name)) s = 100
  else if (/Enhanced/i.test(v.name)) s = 80
  else if (gender(v.name)) s = 60
  else if (ELOQUENCE.has(baseName(v.name))) s = 10
  const lang = v.lang.replace('_', '-')
  if (lang === 'en-US') s += 5
  else if (lang === 'en-GB') s += 3
  return s
}

/** 英語の声を、聞きやすい順に並べる（ネタ用の声は除く） */
export function rankVoices<T extends VoiceInfo>(voices: readonly T[]): T[] {
  return voices
    .filter((v) => v.lang.toLowerCase().startsWith('en') && !isNovelty(v))
    .sort((a, b) => score(b) - score(a))
}

/**
 * 会話の A 役と B 役の声を決める。
 * A は指定があればその声、なければいちばん聞きやすい声。B はなるべく A と性別がちがう声。
 */
export function pickVoices<T extends VoiceInfo>(
  ranked: readonly T[],
  preferredName?: string,
): { a?: T; b?: T } {
  const a = ranked.find((v) => v.name === preferredName) ?? ranked[0]
  if (!a) return {}
  const g = gender(a.name)
  const others = ranked.filter((v) => v.name !== a.name)
  const b = (g && others.find((v) => gender(v.name) && gender(v.name) !== g)) ?? others[0] ?? a
  return { a, b }
}
