import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const tab = (to: string, label: string, ja: string, active: boolean) => (
    <Link
      to={to}
      className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-sm ${
        active ? 'font-bold text-shu' : 'text-fog'
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px] leading-none">{ja}</span>
    </Link>
  )
  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col">
      <header className="flex items-baseline justify-between px-4 pb-2 pt-4">
        <Link to="/" className="font-display text-lg font-bold tracking-wide">
          Japan <span className="text-shu">旅</span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.2em] text-fog">Trip companion</span>
      </header>
      <div className="rule mx-4" />
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t border-sand bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-app">
          {tab('/', 'Journey', '旅程', pathname === '/' || pathname.startsWith('/zones') || pathname.startsWith('/places'))}
          {tab('/files', 'Documents', '書類', pathname.startsWith('/files'))}
        </div>
      </nav>
    </div>
  )
}
