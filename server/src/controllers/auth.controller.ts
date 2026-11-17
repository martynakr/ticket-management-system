// Controller layer: translates between HTTP and the service. It validates
// the request, calls the service, and shapes the response.
import type { Request, Response } from 'express'
import { setAuthCookie } from '../auth/cookie.js'
import { loginSchema } from '../schemas/auth.schema.js'
import * as authService from '../services/auth.service.js'
import { validate } from '../validation/validate.js'

// POST /api/auth/login  { email, password }
export async function login(req: Request, res: Response): Promise<void> {
  const input = validate(loginSchema, req.body)

  const { user, token } = await authService.login(input)

  // The token goes in an httpOnly cookie, not the response body.
  setAuthCookie(res, token)
  res.json({ user })
}
