let ctx: AudioContext | undefined

function tone(freq: number, start: number, duration: number): void {
  ctx ??= new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  const t = ctx.currentTime + start
  gain.gain.setValueAtTime(0.18, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration)
}

/** 正解: ピンポン */
export function playCorrect(): void {
  try {
    tone(880, 0, 0.18)
    tone(1175, 0.15, 0.3)
  } catch {
    // 音が出せない環境では何もしない
  }
}

/** 不正解: ブー（やさしめ） */
export function playWrong(): void {
  try {
    tone(220, 0, 0.35)
  } catch {
    // 音が出せない環境では何もしない
  }
}
