import { useEffect, useState } from 'react'
import { COURSE_SIZES, type Course } from '../lib/courses'
import { streakDays, toDateKey, weakIds } from '../lib/progress'
import { onVoicesChanged, speakLines, voiceNames } from '../lib/speech'
import type { Progress, Settings } from '../types'

interface Props {
  progress: Progress
  onStart: (course: Course) => void
  onChangeSettings: (settings: Settings) => void
  onShowAbout: () => void
}

const RATES = [
  { label: 'ゆっくり', value: 0.7 },
  { label: 'ふつう', value: 0.85 },
  { label: 'はやい', value: 1.0 },
]

export default function Home({ progress, onStart, onChangeSettings, onShowAbout }: Props) {
  const today = toDateKey(new Date())
  const todayCount = progress.daily[today] ?? 0
  const streak = streakDays(progress, today)
  const weakCount = weakIds(progress).length
  const learned = Object.values(progress.records).filter((r) => r.box >= 3).length

  // 声のリストは少しおくれて読みこまれることがある
  const [voices, setVoices] = useState(voiceNames)
  const [voicesChecked, setVoicesChecked] = useState(false)
  useEffect(() => {
    const unsubscribe = onVoicesChanged(() => setVoices(voiceNames()))
    const timer = setTimeout(() => setVoicesChecked(true), 1500)
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const tryVoice = (settings: Settings) =>
    speakLines(
      [
        { speaker: 'A', text: 'Hello. How are you today?' },
        { speaker: 'B', text: "I'm fine, thank you." },
      ],
      settings,
    )

  const changeVoice = (voiceName: string) => {
    const settings = { ...progress.settings, voiceName: voiceName || undefined }
    onChangeSettings(settings)
    tryVoice(settings)
  }

  return (
    <div className="home">
      <h1>
        えいけん<span className="accent">4</span>きゅう
        <br />
        れんしゅう
      </h1>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{todayCount}</div>
          <div className="stat-label">今日 といた 数</div>
        </div>
        <div className="stat">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">れんぞく 日数</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {learned}
            <small>/{COURSE_SIZES.grammar + COURSE_SIZES.words}</small>
          </div>
          <div className="stat-label">おぼえた もんだい</div>
        </div>
      </div>

      <p className="stats-caption">
        💡 同じ もんだいに <strong>2回 れんぞくで せいかい</strong>すると「おぼえた」に なるよ。
        <button className="text-button" onClick={onShowAbout}>
          もっと くわしく ？
        </button>
      </p>

      <div className="menu">
        <div className="menu-row">
          <button className="big-button primary" onClick={() => onStart('grammar')}>
            ✏️ 文の もんだい
            <span className="sub">10もん</span>
          </button>
          <button className="big-button words" onClick={() => onStart('words')}>
            🔤 たんご
            <span className="sub">10もん</span>
          </button>
        </div>
        <button
          className="big-button secondary"
          onClick={() => onStart('weak')}
          disabled={weakCount === 0}
        >
          📒 にがてノート
          <span className="sub">{weakCount === 0 ? '今は なし' : `${weakCount}もん`}</span>
        </button>
      </div>

      <div className="settings">
        <span>読み上げの はやさ：</span>
        <div className="settings-controls">
          {RATES.map((r) => (
            <button
              key={r.value}
              className={`chip ${progress.settings.rate === r.value ? 'active' : ''}`}
              onClick={() => onChangeSettings({ ...progress.settings, rate: r.value })}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings">
        <label htmlFor="voice">声：</label>
        <div className="settings-controls">
          <select
            id="voice"
            value={progress.settings.voiceName ?? ''}
            onChange={(e) => changeVoice(e.target.value)}
          >
            <option value="">おまかせ</option>
            {voices.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button className="chip" onClick={() => tryVoice(progress.settings)}>
            🔊 ためしに 聞く
          </button>
        </div>
      </div>

      {voicesChecked && voices.length === 0 && (
        <p className="warning">
          英語の読み上げ音声が見つかりませんでした。OSの設定で英語の音声を追加してください。
        </p>
      )}
    </div>
  )
}
