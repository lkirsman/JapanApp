// Vercel serverless entry — one catch-all function for the whole Node backend
// (plan R4). `api/[...path].ts` handles every /api/* request natively (no
// rewrite needed); the Express app, mounted at /api, receives the original URL.
import { createApp } from '../server/src/app'

export default createApp()
