import { useCallback, useEffect, useRef, useState } from 'react'
import { Explanation, Prompt } from '../components/QuizItemView'
import { canSpeak, instruction, speakItem } from '../lib/quizItem'
import { playCorrect, playWrong } from '../lib/sound'
import { stopSpeaking } from '../lib/speech'
import type { QuizItem, Settings } from '../types'

export interface AnswerResult {
  question: QuizItem
  chosen: string
  correct: boolean
}

interface Props {
  items: QuizItem[]
  settings: Settings
  onAnswer: (questionId: string, correct: boolean) => void
  onFinish: (results: AnswerResult[]) => void
  onQuit: () => void
}

export default function Quiz({ items, settings, onAnswer, onFinish, onQuit }: Props) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [results, setResults] = useState<AnswerResult[]>([])
  const speakTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const question = items[index]
  const answered = chosen !== null

  const choose = useCallback(
    (choice: string) => {
      if (answered) return
      const correct = choice === question.answer
      setChosen(choice)
      setResults((prev) => [...prev, { question, chosen: choice, correct }])
      onAnswer(question.id, correct)
      if (correct) playCorrect()
      else playWrong()
      // 効果音のあとに、正しい英語を読み上げる
      speakTimer.current = setTimeout(() => speakItem(question, settings, true), 600)
    },
    [answered, question, settings, onAnswer],
  )

  const next = useCallback(() => {
    clearTimeout(speakTimer.current)
    stopSpeaking()
    if (index + 1 >= items.length) {
      onFinish(results)
      return
    }
    setIndex(index + 1)
    setChosen(null)
  }, [index, items.length, results, onFinish])

  const speak = useCallback(
    () => speakItem(question, settings, answered),
    [question, settings, answered],
  )

  useEffect(() => () => clearTimeout(speakTimer.current), [])

  // 英→日の単語問題は、出題と同時に発音を聞かせる
  useEffect(() => {
    if (question?.kind === 'word' && question.direction === 'en-ja') {
      speakItem(question, settings, false)
    }
    // settings はクイズ中に変わらないので、実際には問題が変わったときだけ読む
  }, [question, settings])

  // キーボード: 1〜4 でこたえる、スペースでよみあげ、Enter でつぎへ

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || !question) return
      const n = Number(e.key)
      if (!answered && n >= 1 && n <= question.choices.length) {
        choose(question.choices[n - 1])
      } else if (e.key === ' ') {
        e.preventDefault()
        speak()
      } else if (e.key === 'Enter' && answered) {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, question, choose, speak, next])

  if (items.length === 0) {
    return (
      <div className="quiz">
        <p>もんだいが ありません。</p>
        <button className="big-button primary" onClick={onQuit}>
          もどる
        </button>
      </div>
    )
  }

  const isCorrect = chosen === question.answer

  return (
    <div className="quiz">
      <header className="quiz-header">
        <button className="text-button" onClick={onQuit}>
          ← やめる
        </button>
        <div className="progress-bar" aria-label={`${index + 1} / ${items.length}`}>
          <div
            className="progress-fill"
            style={{ width: `${((index + (answered ? 1 : 0)) / items.length) * 100}%` }}
          />
        </div>
        <span className="counter">
          {index + 1} / {items.length}
        </span>
      </header>

      <p className="instruction">{instruction(question)}</p>

      <div className="card">
        <Prompt item={question} answered={answered} />
        {canSpeak(question, answered) && (
          <button className="speak-button" onClick={speak} title="よみあげ（スペースキー）">
            🔊 きく
          </button>
        )}
      </div>

      <div className="choices">
        {question.choices.map((choice, i) => {
          let state = ''
          if (answered && choice === question.answer) state = 'correct'
          else if (answered && choice === chosen) state = 'wrong'
          return (
            <button
              key={choice}
              className={`choice ${state}`}
              onClick={() => choose(choice)}
              disabled={answered}
            >
              <span className="choice-number">{i + 1}</span>
              {choice}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`feedback ${isCorrect ? 'good' : 'bad'}`}>
          <div className="feedback-mark">{isCorrect ? '⭕ せいかい！' : '❌ ざんねん'}</div>
          <Explanation item={question} />
          <button className="big-button primary" onClick={next} autoFocus>
            {index + 1 >= items.length ? 'けっかを見る' : 'つぎへ'} <span className="sub">Enter</span>
          </button>
        </div>
      )}
    </div>
  )
}
