export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-fog" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-shu" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
