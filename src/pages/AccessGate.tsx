import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAccessCode } from '../api/client'

export default function AccessGate() {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      setAccessCode(code.trim())
      await api.post('/auth/verify', { code: code.trim() })
      navigate('/', { replace: true })
    } catch {
      setAccessCode('') // don't keep a wrong code around
      localStorage.removeItem('trip_access_code')
      setError('Wrong code — try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <p className="font-display text-5xl font-bold">
          日本<span className="text-shu">の</span>旅
        </p>
        <p className="mt-3 text-sm text-fog">Yuval &amp; Luz in Japan</p>
      </div>
      <form onSubmit={submit} className="flex w-full flex-col gap-3">
        <label className="label" htmlFor="code">
          Access code
        </label>
        <input
          id="code"
          className="field text-center tracking-widest"
          type="password"
          inputMode="text"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="••••••••"
        />
        {error && <p className="text-center text-sm text-shu">{error}</p>}
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Checking…' : 'Enter 入る'}
        </button>
      </form>
    </div>
  )
}
