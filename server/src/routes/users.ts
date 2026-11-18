import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { requireAdmin } from '../middleware/require-admin.js'
import { requireAuth } from '../middleware/require-auth.js'
import { createUserSchema } from '../schemas/user.schema.js'
import { validateBody } from '../validation/validate.js'

const router = Router()

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validateBody(createUserSchema),
  userController.createUser,
)

export default router
