import type { DataStore } from '../lib/datastore.js'
import { CATEGORIES } from '../lib/datastore.js'

export interface SearchResult {
  type: 'place' | 'zone' | 'tip'
  id: string
  title: string
  subtitle: string
  href: string
}

export async function searchAll(store: DataStore, query: string): Promise<{ results: SearchResult[] }> {
  const q = query.trim()
  if (q.length < 2) return { results: [] }

  const { places, zones, tips } = await store.search(q)
  const zoneName = new Map(zones.map((z) => [z.id, z.name]))

  const results: SearchResult[] = [
    ...zones.map((z) => ({
      type: 'zone' as const,
      id: z.id,
      title: z.name,
      subtitle: 'Zone',
      href: `/zones/${z.id}`,
    })),
    ...places.map((p) => ({
      type: 'place' as const,
      id: p.id,
      title: p.name,
      subtitle: CATEGORIES.includes(p.category) ? p.category : 'place',
      href: `/places/${p.id}`,
    })),
    ...tips.map((t) => ({
      type: 'tip' as const,
      id: t.id,
      title: t.body.length > 80 ? `${t.body.slice(0, 80)}…` : t.body,
      subtitle: t.zone_id ? `Tip · ${zoneName.get(t.zone_id) ?? 'zone'}` : 'Tip',
      href: t.place_id ? `/places/${t.place_id}` : `/zones/${t.zone_id}`,
    })),
  ]
  return { results }
}
