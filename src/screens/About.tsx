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
        <h3>📒「おぼえた もんだい」って なに？</h3>
        <p>
          もんだいに <strong>2かい れんぞくで せいかい</strong> すると、「おぼえた もんだい」に
          なるよ。
        </p>
        <p>
          1かいめに せいかいしても、まだ「おぼえた」には ならないよ。もういちど おなじ もんだいが
          でてきて、また せいかいできたら「おぼえた」に なるんだ。
        </p>
        <p>
          もし とちゅうで まちがえたら、「おぼえた」までの みちのりは さいしょから やりなおしに
          なるよ。まちがえた もんだいは 📒にがてノートに はいって、つぎの日に また
          でてくるから、わすれるまえに れんしゅうできるよ。
        </p>
      </section>

      <section className="about-section">
        <h3>🔢「{total}」って なに？</h3>
        <p>この アプリに ある、ぜんぶの もんだいの かずだよ。</p>
        <div className="about-formula">
          <div className="about-formula-row">
            <span>✏️ ぶんの もんだい</span>
            <span>{grammarCount}もん</span>
          </div>
          <div className="about-formula-row">
            <span>🔤 たんご</span>
            <span>
              {wordCount}こ × 2（えいご→にほんご と にほんご→えいご）＝ {wordQuestionCount}もん
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
          ひとつの たんごから、「えいご→にほんご」と「にほんご→えいご」の 2つの もんだいが
          できるから、たんごの かず（{wordCount}こ）の 2ばいに なるんだね。
        </p>
      </section>

      <section className="about-section">
        <h3>📅「れんぞく にっすう」って なに？</h3>
        <p>
          まいにち れんしゅうすると、ふえていく かずだよ。もし 1にちでも おやすみすると、また
          1から スタートに なるよ。まいにち コツコツ つづけてみよう！
        </p>
      </section>

      <section className="about-section">
        <h3>📝「きょう といた かず」って なに？</h3>
        <p>
          きょう こたえた もんだいの かずだよ。「ぶんの もんだい」でも「たんご」でも「にがてノート」
          でも、こたえたら 1ずつ ふえていくよ。
        </p>
      </section>

      <button className="big-button primary" onClick={onBack}>
        わかった！ホームへ
      </button>
    </div>
  )
}
