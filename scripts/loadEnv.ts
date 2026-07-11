// Minimal .env.local loader for scripts (no dotenv dependency). Real deployments
// use platform env vars; this is only for local `npm run seed` / `seed:files`.
import { readFileSync } from 'node:fs'

export function loadEnv() {
  try {
    for (const line of readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2]
    }
  } catch {
    // no .env.local — assume env vars are already set in the environment
  }
}
