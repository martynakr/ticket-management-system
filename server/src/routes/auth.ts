import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/require-auth.js'
import { loginSchema } from '../schemas/auth.schema.js'
import { validateBody } from '../validation/validate.js'

const router = Router()

router.post('/login', validateBody(loginSchema), authController.login)
router.post('/logout', requireAuth, authController.logout)

export default router
