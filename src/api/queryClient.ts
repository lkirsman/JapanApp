import { QueryClient } from '@tanstack/react-query'

// Tuned for slow/intermittent connections while traveling (FR-013):
// previously loaded content stays on screen; refetch-on-focus keeps the other
// traveler's edits visible on next view (FR-018).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})
