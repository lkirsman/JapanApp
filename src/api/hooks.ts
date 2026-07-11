import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import type { Category, FileMeta, PlaceDetail, PlaceListItem, TripBundle, ZoneDetail } from './types'

export const useTrip = () =>
  useQuery({ queryKey: ['trip'], queryFn: () => api.get<TripBundle>('/trip') })

export const useZone = (zoneId: string) =>
  useQuery({ queryKey: ['zone', zoneId], queryFn: () => api.get<ZoneDetail>(`/zones/${zoneId}`) })

export const useZonePlaces = (zoneId: string, category: Category) =>
  useQuery({
    queryKey: ['zone-places', zoneId, category],
    queryFn: () =>
      api.get<{ places: PlaceListItem[] }>(`/zones/${zoneId}/places?category=${category}`),
  })

export const usePlace = (placeId: string) =>
  useQuery({
    queryKey: ['place', placeId],
    queryFn: () => api.get<PlaceDetail>(`/places/${placeId}`),
    enabled: placeId !== '', // PlaceForm in add mode has no place to fetch
  })

export const useTripFiles = () =>
  useQuery({ queryKey: ['trip-files'], queryFn: () => api.get<{ files: FileMeta[] }>('/files') })
