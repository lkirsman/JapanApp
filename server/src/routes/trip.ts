import { Router } from 'express'
import { asyncHandler } from '../lib/errors'
import { getDataStore } from '../lib/datastore'
import { getTripBundle } from '../services/trips'

export const tripRouter = Router()

tripRouter.get(
  '/trip',
  asyncHandler(async (_req, res) => {
    res.json(await getTripBundle(await getDataStore()))
  })
)
