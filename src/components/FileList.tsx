// Files with recognizable name/type; tap → resolve URL → open (FR-008).
// FILE_MISSING shows a clear inline error instead of a blank screen (FR-013).
// When `deletable` is set, each file gets a confirmed delete (owner passed for
// cache invalidation).
import { useState } from 'react'
import { ApiError, api } from '../api/client'
import { useDeleteFile } from '../api/mutations'
import type { FileMeta, FileParent } from '../api/types'
import { ConfirmDialog } from './ConfirmDialog'

const icon = (mime: string) => {
  if (mime.includes('pdf')) return '📄'
  if (mime.startsWith('image/')) return '🖼️'
  return '📎'
}

const size = (bytes: number) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FileList({ files, deletable }: { files: FileMeta[]; deletable?: FileParent }) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<FileMeta | null>(null)
  const remove = useDeleteFile(deletable)

  async function open(file: FileMeta) {
    setBusyId(file.id)
    setErrors((e) => ({ ...e, [file.id]: '' }))
    try {
      const { url } = await api.get<{ url: string }>(`/files/${file.id}/url`)
      window.open(url, '_blank', 'noopener')
    } catch (err) {
      const message =
        err instanceof ApiError && err.code === 'FILE_MISSING'
          ? 'This file is missing from storage.'
          : 'Could not open the file — try again.'
      setErrors((e) => ({ ...e, [file.id]: message }))
    } finally {
      setBusyId(null)
    }
  }

  if (files.length === 0) return null

  return (
    <>
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.id}>
            <div className="flex items-center gap-1 rounded-2xl border border-line bg-white pr-2">
              <button
                type="button"
                onClick={() => open(file)}
                disabled={busyId === file.id}
                className="flex min-h-11 flex-1 items-center gap-3 px-4 py-3 text-left active:scale-[0.99]"
              >
                <span className="text-lg" aria-hidden>
                  {icon(file.mime_type)}
                </span>
                <span className="flex-1 text-sm font-semibold">{file.display_name}</span>
                <span className="text-xs text-muted">
                  {busyId === file.id ? 'Opening…' : size(file.size_bytes)}
                </span>
              </button>
              {deletable && (
                <button
                  type="button"
                  aria-label={`Delete ${file.display_name}`}
                  onClick={() => setDeleting(file)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted active:scale-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              )}
            </div>
            {errors[file.id] && <p className="mt-1 px-4 text-sm text-brand">{errors[file.id]}</p>}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={deleting !== null}
        title={deleting ? `Delete "${deleting.display_name}"?` : ''}
        message="This removes the file and its stored copy. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id)
          setDeleting(null)
        }}
        onCancel={() => setDeleting(null)}
      />
    </>
  )
}
