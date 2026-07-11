import { Link, useParams } from 'react-router-dom'
import { useZone, useZonePlaces } from '../api/hooks'
import type { Category } from '../api/types'
import { CATEGORY_LABELS } from '../api/types'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'

export default function CategoryList() {
  const { zoneId = '', category = '' } = useParams()
  const cat = category as Category
  const zone = useZone(zoneId)
  const { data, isPending, isError, refetch } = useZonePlaces(zoneId, cat)

  const label = CATEGORY_LABELS[cat] ?? { en: category, ja: '' }

  if (isPending) return <Loading />
  if (isError) return <ErrorState message="Could not load places." onRetry={() => refetch()} />

  return (
    <div>
      <Link to={`/zones/${zoneId}`} className="text-xs text-fog">
        ← {zone.data?.zone.name ?? 'Zone'}
      </Link>
      <div className="mt-2 flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold">
          {label.en} <span className="ml-1 text-base font-normal text-fog">{label.ja}</span>
        </h1>
        <Link to={`/zones/${zoneId}/places/new?category=${cat}`} className="text-sm font-medium text-shu">
          + Add
        </Link>
      </div>

      {data.places.length === 0 ? (
        <EmptyState message={`Nothing saved under ${label.en.toLowerCase()} here yet.`} />
      ) : (
        <ul className="mt-4 space-y-2">
          {data.places.map((p) => (
            <li key={p.id}>
              <Link
                to={`/places/${p.id}`}
                className="block rounded-lg border border-sand bg-white/50 px-4 py-3 active:bg-white/80"
              >
                <p className="font-medium">
                  {p.name}
                  {p.name_ja && <span className="ml-2 text-sm font-normal text-fog">{p.name_ja}</span>}
                </p>
                {p.summary_line && <p className="mt-0.5 line-clamp-2 text-sm text-fog">{p.summary_line}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
