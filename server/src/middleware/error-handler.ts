import type { ErrorRequestHandler, RequestHandler } from 'express'
import { HttpError } from '../errors/http-error.js'

// Without this, Express answers unknown routes with an HTML page.
export const notFoundHandler: RequestHandler = (req, _res) => {
  throw new HttpError(404, `Route not found: ${req.method} ${req.path}`)
}

// Express only treats this as an error handler because it takes four arguments.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, fields: error.fields })
    return
  }

  // The parser's own message leaks details like "Unexpected token n at position 2".
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Malformed JSON in request body' })
    return
  }

  // Express middleware errors (e.g. 413) set `expose` when the message is safe to show.
  if (typeof error?.status === 'number' && error.status < 500 && error.expose) {
    res.status(error.status).json({ error: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}
