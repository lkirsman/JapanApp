import { Router } from 'express'
import { asyncHandler } from '../lib/errors'
import { getDataStore } from '../lib/datastore'

// No auth (cron keep-alive target, research R3). One trivial datastore read.
export const healthRouter = Router()

healthRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    const store = await getDataStore()
    await store.ping()
    res.json({ ok: true })
  })
)
