import { words } from '../data'
import { COURSE_SIZES } from '../lib/courses'

interface Props {
  onBack: () => void
}

export default function About({ onBack }: Props) {
  const wordCount = words.length
  const wordQuestionCount = COURSE_SIZES.words
  const grammarCount = COURSE_SIZES.grammar
  const total = grammarCount + wordQuestionCount

  return (
    <div className="about">
      <button className="text-button" onClick={onBack}>
        ← ホームへ もどる
      </button>

      <h2>アプリの せつめい</h2>

      <section className="about-section">
        <h3>📒「おぼえた もんだい」って 何？</h3>
        <p>
          もんだいに <strong>2回 れんぞくで せいかい</strong> すると、「おぼえた もんだい」に
          なるよ。
        </p>
        <p>
          1回目に せいかいしても、まだ「おぼえた」には ならないよ。もういちど 同じ もんだいが
          出てきて、また せいかいできたら「おぼえた」に なるんだ。
        </p>
        <p>
          もし とちゅうで まちがえたら、「おぼえた」までの 道のりは さいしょから やりなおしに
          なるよ。まちがえた もんだいは 📒にがてノートに 入って、つぎの日に また
          出てくるから、わすれる前に れんしゅうできるよ。
        </p>
      </section>

      <section className="about-section">
        <h3>🔢「{total}」って 何？</h3>
        <p>この アプリに ある、ぜんぶの もんだいの 数だよ。</p>
        <div className="about-formula">
          <div className="about-formula-row">
            <span>✏️ 文の もんだい</span>
            <span>{grammarCount}もん</span>
          </div>
          <div className="about-formula-row">
            <span>🔤 たんご</span>
            <span>
              {wordCount}こ × 2（えいご→日本語 と 日本語→えいご）＝ {wordQuestionCount}もん
            </span>
          </div>
          <div className="about-formula-row total">
            <span>ぜんぶで</span>
            <span>
              {grammarCount} ＋ {wordQuestionCount} ＝ {total}もん
            </span>
          </div>
        </div>
        <p>
          一つの たんごから、「えいご→日本語」と「日本語→えいご」の 2つの もんだいが
          できるから、たんごの 数（{wordCount}こ）の 2ばいに なるんだね。
        </p>
      </section>

      <section className="about-section">
        <h3>📅「れんぞく 日数」って 何？</h3>
        <p>
          毎日 れんしゅうすると、ふえていく 数だよ。もし 1日でも お休みすると、また
          1から スタートに なるよ。毎日 コツコツ つづけてみよう！
        </p>
      </section>

      <section className="about-section">
        <h3>📝「今日 といた 数」って 何？</h3>
        <p>
          今日 答えた もんだいの 数だよ。「文の もんだい」でも「たんご」でも「にがてノート」
          でも、答えたら 1ずつ ふえていくよ。
        </p>
      </section>

      <button className="big-button primary" onClick={onBack}>
        わかった！ホームへ
      </button>
    </div>
  )
}
