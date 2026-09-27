import type { QuizItem } from '../types'
import Sentence from './Sentence'

/** 問題文。answered なら答えを入れて表示する */
export function Prompt({ item, answered }: { item: QuizItem; answered: boolean }) {
  if (item.kind === 'fill-blank') {
    return <Sentence lines={item.lines} filled={answered ? item.answer : undefined} />
  }
  const { word, direction } = item
  return (
    <div className="word-prompt">
      <span className={direction === 'en-ja' ? 'word-en' : 'word-ja'}>
        {direction === 'en-ja' ? word.en : word.ja}
      </span>
      {answered && (
        <span className="word-pair">
          {direction === 'en-ja' ? word.ja : word.en}
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
