import type { Request, RequestHandler } from 'express'
import { z } from 'zod'
import { HttpError } from '../errors/http-error.js'

// Replaces req.body with the parsed data (transforms applied, unknown keys
// stripped), or throws a 400 with per-field messages.
export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    // An empty body is undefined; parse {} so each missing field gets its own message.
    const result = schema.safeParse(req.body ?? {})

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error)
      throw new HttpError(400, 'Invalid input', fieldErrors)
    }

    req.body = result.data
    next()
  }
}

// Types req.body in a controller whose route uses validateBody.
export type ValidatedRequest<Body> = Request<Record<string, string>, unknown, Body>
