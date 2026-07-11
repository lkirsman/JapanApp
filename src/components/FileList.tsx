// Files with recognizable name/type; tap → resolve URL → open (FR-008).
// FILE_MISSING shows a clear inline error instead of a blank screen (FR-013).
import { useState } from 'react'
import { ApiError, api } from '../api/client'
import type { FileMeta } from '../api/types'

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

export function FileList({ files }: { files: FileMeta[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)

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
    <ul className="space-y-2">
      {files.map((file) => (
        <li key={file.id}>
          <button
            type="button"
            onClick={() => open(file)}
            disabled={busyId === file.id}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-sand bg-white/50 px-3 py-2.5 text-left active:bg-white/80"
          >
            <span aria-hidden>{icon(file.mime_type)}</span>
            <span className="flex-1 text-sm font-medium">{file.display_name}</span>
            <span className="text-xs text-fog">{busyId === file.id ? 'Opening…' : size(file.size_bytes)}</span>
          </button>
          {errors[file.id] && <p className="mt-1 px-3 text-sm text-shu">{errors[file.id]}</p>}
        </li>
      ))}
    </ul>
  )
}
