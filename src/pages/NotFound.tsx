import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="font-display text-4xl">迷子</p>
      <p className="text-sm text-fog">This page doesn't exist — lost like tourists in Shinjuku station.</p>
      <Link to="/" className="btn-primary">
        Back to the journey
      </Link>
    </div>
  )
}
