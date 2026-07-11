import { describe, expect, it } from 'vitest'
import { timeUntil } from '../lib/countdown'

describe('timeUntil', () => {
  it('breaks the remaining time into days/hours/minutes/seconds', () => {
    const now = new Date('2026-09-16T12:00:00+03:00')
    const target = new Date('2026-09-18T16:15:00+03:00')
    expect(timeUntil(target, now)).toEqual({
      days: 2,
      hours: 4,
      minutes: 15,
      seconds: 0,
      done: false,
    })
  })

  it('counts partial minutes and seconds', () => {
    const now = new Date('2026-09-18T16:14:30+03:00')
    const target = new Date('2026-09-18T16:15:00+03:00')
    expect(timeUntil(target, now)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 30 })
  })

  it('is done once the target has passed', () => {
    const now = new Date('2026-09-18T16:15:01+03:00')
    const target = new Date('2026-09-18T16:15:00+03:00')
    expect(timeUntil(target, now).done).toBe(true)
  })

  it('is timezone-independent (compares absolute instants)', () => {
    // same instant expressed in UTC vs the +03:00 target
    const now = new Date('2026-09-18T13:15:00Z') // == 16:15:00+03:00
    const target = new Date('2026-09-18T16:15:00+03:00')
    expect(timeUntil(target, now).done).toBe(true)
  })
})
