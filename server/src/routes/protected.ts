import { Router } from 'express'
import { requireAuth } from '../middleware/require-auth.js'

// Temporary route for trying out requireAuth.
const router = Router()

router.get('/', requireAuth, (req, res) => {
  res.json({ message: `You see this because you are logged in, ${req.user!.name}` })
})

export default router
