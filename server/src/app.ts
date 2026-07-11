import express from 'express'
import { authMiddleware } from './lib/auth'
import { errorMiddleware, notFound } from './lib/errors'
import { authRouter } from './routes/auth'
import { filesRouter } from './routes/files'
import { healthRouter } from './routes/health'
import { placesRouter } from './routes/places'
import { tipsRouter } from './routes/tips'
import { tripRouter } from './routes/trip'
import { zonesRouter } from './routes/zones'

export function createApp() {
  const app = express()
  app.use(express.json({ limit: '256kb' }))
  app.use(authMiddleware)

  app.use('/api', healthRouter)
  app.use('/api', authRouter)
  app.use('/api', tripRouter)
  app.use('/api', zonesRouter)
  app.use('/api', placesRouter)
  app.use('/api', tipsRouter)
  app.use('/api', filesRouter)

  app.use('/api', (_req, _res, next) => next(notFound('Endpoint')))
  app.use(errorMiddleware)
  return app
}
