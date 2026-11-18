import type { Request, Response } from 'express'
import { clearAuthCookie, setAuthCookie } from '../auth/cookie.js'
import { toPublicUser } from '../models/user.js'
import type { LoginInput } from '../schemas/auth.schema.js'
import * as authService from '../services/auth.service.js'
import type { ValidatedRequest } from '../validation/validate.js'

export async function login(req: ValidatedRequest<LoginInput>, res: Response): Promise<void> {
  const { user, token } = await authService.login(req.body)

  setAuthCookie(res, token)
  res.json({ user })
}

export async function logout(req: Request, res: Response): Promise<void> {
  await authService.logout(req.user!.id)

  clearAuthCookie(res)
  res.status(204).end()
}

export function me(req: Request, res: Response): void {
  res.json({ user: toPublicUser(req.user!) })
}
