import type { RequestHandler } from 'express'
import { HttpError } from '../errors/http-error.js'

// Use after requireAuth.
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== 'admin') throw new HttpError(403, 'Admin access required')
  next()
}
