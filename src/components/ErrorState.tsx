// Clear error + retry path (FR-013) — shown whenever data can't be fetched/saved.
export function ErrorState({
  message = 'Could not load this right now.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-shu/30 bg-shu/5 px-4 py-8 text-center">
      <span className="font-display text-2xl text-shu">×</span>
      <p className="text-sm text-sumi">{message}</p>
      {onRetry && (
        <button type="button" className="btn-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
