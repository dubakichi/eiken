import Sentence from '../components/Sentence'
import { speakLines } from '../lib/speech'
import { TAG_LABELS, type Settings } from '../types'
import type { AnswerResult } from './Quiz'

interface Props {
  results: AnswerResult[]
  settings: Settings
  onRetry: () => void
  onHome: () => void
}

function message(ratio: number): string {
  if (ratio === 1) return 'ぜんもん せいかい！すごい！'
  if (ratio >= 0.8) return 'よくできました！'
  if (ratio >= 0.6) return 'いいちょうし！'
  return 'まちがえた もんだいを 見なおそう！'
}

export default function Result({ results, settings, onRetry, onHome }: Props) {
  const correctCount = results.filter((r) => r.correct).length
  const ratio = results.length === 0 ? 0 : correctCount / results.length
  const mistakes = results.filter((r) => !r.correct)

  return (
    <div className="result">
      <h2>けっか</h2>
      <div className="score">
        {correctCount} <small>/ {results.length} もん</small>
      </div>
      <div className="stamps" aria-hidden>
        {results.map((r, i) => (
          <span key={i} className={`stamp ${r.correct ? 'good' : 'bad'}`}>
            {r.correct ? '◎' : '・'}
          </span>
        ))}
      </div>
      <p className="result-message">{message(ratio)}</p>

      {mistakes.length > 0 && (
        <section className="review">
          <h3>まちがえた もんだい</h3>
          <p className="note">にがてノートに いれたよ。あした また でるよ。</p>
          {mistakes.map(({ question, chosen }) => (
            <div key={question.id} className="review-item">
              <div className="review-tags">
                {question.tags.map((t) => (
                  <span key={t} className="tag">
                    {TAG_LABELS[t]}
                  </span>
                ))}
              </div>
              <Sentence lines={question.lines} filled={question.answer} />
              <p className="review-answer">
                こたえ：<strong>{question.answer}</strong>
                <span className="your-answer">（えらんだのは {chosen}）</span>
              </p>
              <p className="feedback-ja">{question.ja}</p>
              <p className="feedback-explanation">💡 {question.explanation}</p>
              <button
                className="speak-button small"
                onClick={() => speakLines(question.lines, settings, question.answer)}
              >
                🔊 きく
              </button>
            </div>
          ))}
        </section>
      )}

      <div className="menu">
        <button className="big-button primary" onClick={onRetry}>
          もういちど
        </button>
        <button className="big-button secondary" onClick={onHome}>
          ホームへ
        </button>
      </div>
    </div>
  )
}
