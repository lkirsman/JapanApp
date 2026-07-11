import { Router } from 'express'
import { asyncHandler } from '../lib/errors.js'
import { getDataStore } from '../lib/datastore.js'
import { createFile, deleteFile, getFileUrl, listTripDocuments } from '../services/files.js'

export const filesRouter = Router()

filesRouter.get(
  '/files',
  asyncHandler(async (_req, res) => {
    res.json(await listTripDocuments(await getDataStore()))
  })
)

filesRouter.post(
  '/files',
  asyncHandler(async (req, res) => {
    res.status(201).json(await createFile(await getDataStore(), req.body ?? {}))
  })
)

filesRouter.get(
  '/files/:fileId/url',
  asyncHandler(async (req, res) => {
    res.json(await getFileUrl(await getDataStore(), req.params.fileId))
  })
)

filesRouter.delete(
  '/files/:fileId',
  asyncHandler(async (req, res) => {
    await deleteFile(await getDataStore(), req.params.fileId)
    res.status(204).end()
  })
)
