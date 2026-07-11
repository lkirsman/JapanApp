import { Router } from 'express'
import { asyncHandler } from '../lib/errors'
import { getDataStore } from '../lib/datastore'
import { getFileUrl, listTripFiles } from '../services/files'

export const filesRouter = Router()

filesRouter.get(
  '/files',
  asyncHandler(async (_req, res) => {
    res.json(await listTripFiles(await getDataStore()))
  })
)

filesRouter.get(
  '/files/:fileId/url',
  asyncHandler(async (req, res) => {
    res.json(await getFileUrl(await getDataStore(), req.params.fileId))
  })
)
