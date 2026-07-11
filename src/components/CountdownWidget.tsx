// Live countdown to the first flight's departure, plus the booking reference
// and flight numbers. Ticks every second; `now` is injectable for tests.
import { useEffect, useState } from 'react'
import type { FlightInfo } from '../api/types'
import { timeUntil } from '../lib/countdown'

const fmtDepart = (iso: string) =>
  new Date(iso).toLocaleString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl font-extrabold leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/70">{label}</span>
    </div>
  )
}

export function CountdownWidget({ flight, now }: { flight: FlightInfo; now?: Date }) {
  const [tick, setTick] = useState(() => now ?? new Date())

  useEffect(() => {
    if (now) return // fixed clock (tests)
    const id = setInterval(() => setTick(new Date()), 1000)
    return () => clearInterval(id)
  }, [now])

  const target = new Date(flight.depart_at)
  const left = timeUntil(target, tick)

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 to-brand p-5 text-white shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-white/80">
          {left.done ? 'Takeoff' : 'Countdown to takeoff'}
        </p>
        <span aria-hidden className="text-lg">
          ✈️
        </span>
      </div>

      {left.done ? (
        <p className="mt-2 font-display text-2xl font-extrabold">Bon voyage — you're on your way! 🎌</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2" role="timer" aria-label="Time until departure">
          <Unit value={left.days} label="days" />
          <Unit value={left.hours} label="hrs" />
          <Unit value={left.minutes} label="min" />
          <Unit value={left.seconds} label="sec" />
        </div>
      )}

      <div className="mt-4 space-y-1.5 border-t border-white/20 pt-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/80">Departs</span>
          <span className="font-semibold">{fmtDepart(flight.depart_at)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/80">Booking ref</span>
          <span className="font-mono font-bold tracking-widest">{flight.booking_ref}</span>
        </div>
        <div className="pt-1">
          {flight.legs.map((leg) => (
            <div key={leg.flight_no} className="flex items-center gap-2 py-0.5">
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs font-bold">{leg.flight_no}</span>
              <span className="text-white/90">
                {leg.from} → {leg.to}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
