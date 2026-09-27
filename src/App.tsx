import { useState } from 'react'
import { words } from './data'
import { poolFor, sessionMode, type Course } from './lib/courses'
import { loadProgress, recordAnswer, saveProgress, toDateKey } from './lib/progress'
import { toQuizItem } from './lib/quizItem'
import { buildSession } from './lib/session'
import { stopSpeaking } from './lib/speech'
import Home from './screens/Home'
import Quiz, { type AnswerResult } from './screens/Quiz'
import Result from './screens/Result'
import type { Progress, QuizItem, Settings } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'quiz'; course: Course; items: QuizItem[] }
  | { name: 'result'; course: Course; results: AnswerResult[] }

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  const update = (next: Progress) => {
    setProgress(next)
    saveProgress(next)
  }

  const start = (course: Course) => {
    const today = toDateKey(new Date())
    const picked = buildSession(poolFor(course), progress, today, sessionMode(course))
    setScreen({ name: 'quiz', course, items: picked.map((item) => toQuizItem(item, words)) })
  }

  const goHome = () => {
    stopSpeaking()
    setScreen({ name: 'home' })
  }

  const handleAnswer = (questionId: string, correct: boolean) => {
    update(recordAnswer(progress, questionId, correct, toDateKey(new Date())))
  }

  const changeSettings = (settings: Settings) => update({ ...progress, settings })

  return (
    <main className="app">
      {screen.name === 'home' && (
        <Home progress={progress} onStart={start} onChangeSettings={changeSettings} />
      )}
      {screen.name === 'quiz' && (
        <Quiz
          key={screen.items.map((q) => q.id).join()}
          items={screen.items}
          settings={progress.settings}
          onAnswer={handleAnswer}
          onFinish={(results) => setScreen({ name: 'result', course: screen.course, results })}
          onQuit={goHome}
        />
      )}
      {screen.name === 'result' && (
        <Result
          results={screen.results}
          settings={progress.settings}
          onRetry={() => start(screen.course)}
          onHome={goHome}
        />
      )}
    </main>
  )
}
