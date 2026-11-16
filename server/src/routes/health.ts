import { Router } from 'express'
import { isDatabaseConnected } from '../db.js'

const router = Router()

// GET /api/health: confirms the API is up and can reach MongoDB.
// Returns 503 (Service Unavailable) if the database connection is down.
router.get('/', (_req, res) => {
  const database = isDatabaseConnected() ? 'connected' : 'disconnected'
  const status = database === 'connected' ? 'ok' : 'degraded'

  res.status(status === 'ok' ? 200 : 503).json({
    status,
    database,
    uptime: process.uptime(),
  })
})

export default router
