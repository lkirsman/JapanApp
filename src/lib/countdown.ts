// Pure countdown math so the widget stays trivial and testable. Works off
// absolute instants, so the viewer's timezone doesn't matter.
export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function timeUntil(target: Date, now: Date): Remaining {
  let ms = target.getTime() - now.getTime()
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  const days = Math.floor(ms / 86_400_000)
  ms -= days * 86_400_000
  const hours = Math.floor(ms / 3_600_000)
  ms -= hours * 3_600_000
  const minutes = Math.floor(ms / 60_000)
  ms -= minutes * 60_000
  const seconds = Math.floor(ms / 1_000)
  return { days, hours, minutes, seconds, done: false }
}
