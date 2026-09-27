import { BLANK } from '../lib/speech'
import type { Line } from '../types'

interface Props {
  lines: Line[]
  /** 空所に表示することば。なければ空欄のまま */
  filled?: string
}

export default function Sentence({ lines, filled }: Props) {
  return (
    <div className="sentence">
      {lines.map((line, i) => {
        const [before, after] = line.text.split(BLANK)
        return (
          <p key={i} className="line">
            {line.speaker && <span className="speaker">{line.speaker}:</span>}
            <span>
              {before}
              {after !== undefined && (
                <>
                  <span className={`blank ${filled ? 'filled' : ''}`}>{filled ?? '　'}</span>
                  {after}
                </>
              )}
            </span>
          </p>
        )
      })}
    </div>
  )
}
