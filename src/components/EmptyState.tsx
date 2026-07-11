// Graceful empty state (FR-012) — no errors, no broken navigation.
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center text-fog">
      <span className="font-display text-2xl">〜</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
