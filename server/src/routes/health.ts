import { Router } from 'express'
import { isDatabaseConnected } from '../db.js'

const router = Router()

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
