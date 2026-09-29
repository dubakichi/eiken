import type { QuizItem } from '../types'
import Sentence from './Sentence'

/** 問題文。answered なら答えを入れて表示する */
export function Prompt({ item, answered }: { item: QuizItem; answered: boolean }) {
  if (item.kind === 'fill-blank') {
    return <Sentence lines={item.lines} filled={answered ? item.answer : undefined} />
  }
  const { word, direction } = item
  if (direction === 'en-ja') {
    return (
      <div className="word-prompt">
        <span className="word-en">{word.en}</span>
        <span className="word-kana">{word.kana}</span>
        {answered && <span className="word-pair">{word.ja}</span>}
      </div>
    )
  }
  // 日→英は、カタカナ読みで答えが分かってしまうので答えたあとにだけ出す
  return (
    <div className="word-prompt">
      <span className="word-ja">{word.ja}</span>
      {answered && (
        <span className="word-pair">
          {word.en} <span className="word-kana">{word.kana}</span>
        </span>
      )}
    </div>
  )
}

/** 答えたあとに出す訳と解説 */
export function Explanation({ item }: { item: QuizItem }) {
  if (item.kind === 'fill-blank') {
    return (
      <>
        <p className="feedback-ja">{item.ja}</p>
        <p className="feedback-explanation">💡 {item.explanation}</p>
      </>
    )
  }
  const { word } = item
  return (
    <p className="feedback-explanation">
      💡 {word.en} ＝ {word.ja}
      {word.note && `（${word.note}）`}
    </p>
  )
}
