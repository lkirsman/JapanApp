import { useTrip } from '../api/hooks'
import { ErrorState } from '../components/ErrorState'
import { JourneyTimeline } from '../components/JourneyTimeline'
import { Loading } from '../components/Loading'

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric' })

export default function Journey() {
  const { data, isPending, isError, refetch } = useTrip()

  if (isPending) return <Loading label="Loading the journey…" />
  if (isError) return <ErrorState message="Could not load the trip." onRetry={() => refetch()} />

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-fog">Journey 旅程</p>
      <h1 className="mt-1 font-display text-2xl font-bold">{data.trip.name}</h1>
      <p className="mt-1 text-sm text-fog">
        {fmt(data.trip.start_date)} → {fmt(data.trip.end_date)}
      </p>
      <div className="mt-6">
        <JourneyTimeline steps={data.steps} />
      </div>
    </div>
  )
}
