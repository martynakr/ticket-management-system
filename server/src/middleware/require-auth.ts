import type { RequestHandler } from 'express'
import { AUTH_COOKIE } from '../auth/cookie.js'
import * as authService from '../services/auth.service.js'

export const requireAuth: RequestHandler = async (req, _res, next) => {
  req.user = await authService.authenticate(req.cookies?.[AUTH_COOKIE])
  next()
}
