// Simple vertical journey visualization (FR-005/FR-006, research R7).
// Step status is computed from the device date; `today` is injectable for tests.
import { Link } from 'react-router-dom'
import type { TripStep } from '../api/types'

export type StepStatus = 'past' | 'current' | 'future'

export function stepStatus(step: TripStep, today: Date): StepStatus {
  const day = today.toISOString().slice(0, 10)
  if (day < step.start_date) return 'future'
  if (day > step.end_date) return 'past'
  return 'current'
}

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric' })

export function JourneyTimeline({ steps, today = new Date() }: { steps: TripStep[]; today?: Date }) {
  return (
    <ol className="relative ml-3 border-l border-sand" data-testid="journey-timeline">
      {steps.map((step) => {
        const status = stepStatus(step, today)
        const zone = step.zone
        return (
          <li key={step.id} className="relative pb-6 pl-6 last:pb-0">
            <span
              aria-hidden
              className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                status === 'current'
                  ? 'border-shu bg-shu shadow-[0_0_0_4px_rgba(197,68,45,0.15)]'
                  : status === 'past'
                    ? 'border-sand bg-sand'
                    : 'border-fog/40 bg-paper'
              }`}
            />
            <Link
              to={zone ? `/zones/${zone.id}` : '#'}
              data-status={status}
              className={`block rounded-lg border px-4 py-3 transition-colors ${
                status === 'current'
                  ? 'border-shu/40 bg-white/80'
                  : 'border-sand bg-white/40 active:bg-white/70'
              } ${status === 'past' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-lg font-bold">
                  {zone?.name ?? 'Unknown zone'}
                  {zone?.name_ja && <span className="ml-2 text-sm font-normal text-fog">{zone.name_ja}</span>}
                </span>
                {status === 'current' && (
                  <span className="rounded-full bg-shu px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">
                    Now 今
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-fog">
                {fmt(step.start_date)} – {fmt(step.end_date)}
              </p>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
