import { useState } from 'react'
import { questions } from './data'
import { loadProgress, recordAnswer, saveProgress, toDateKey } from './lib/progress'
import { buildSession, withShuffledChoices, type SessionMode } from './lib/session'
import { stopSpeaking } from './lib/speech'
import Home from './screens/Home'
import Quiz, { type AnswerResult } from './screens/Quiz'
import Result from './screens/Result'
import type { FillBlankQuestion, Progress, Settings } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'quiz'; mode: SessionMode; items: FillBlankQuestion[] }
  | { name: 'result'; mode: SessionMode; results: AnswerResult[] }

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  const update = (next: Progress) => {
    setProgress(next)
    saveProgress(next)
  }

  const start = (mode: SessionMode) => {
    const items = buildSession(questions, progress, toDateKey(new Date()), mode)
    setScreen({ name: 'quiz', mode, items: items.map((q) => withShuffledChoices(q)) })
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
          onFinish={(results) => setScreen({ name: 'result', mode: screen.mode, results })}
          onQuit={goHome}
        />
      )}
      {screen.name === 'result' && (
        <Result
          results={screen.results}
          settings={progress.settings}
          onRetry={() => start(screen.mode)}
          onHome={goHome}
        />
      )}
    </main>
  )
}
