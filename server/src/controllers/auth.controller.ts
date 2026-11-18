import type { Request, Response } from 'express'
import { setAuthCookie } from '../auth/cookie.js'
import { loginSchema } from '../schemas/auth.schema.js'
import * as authService from '../services/auth.service.js'
import { validate } from '../validation/validate.js'

export async function login(req: Request, res: Response): Promise<void> {
  const input = validate(loginSchema, req.body)
  const { user, token } = await authService.login(input)

  setAuthCookie(res, token)
  res.json({ user })
}
