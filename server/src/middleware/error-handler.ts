import type { ErrorRequestHandler } from 'express'
import { HttpError } from '../errors/http-error.js'

// Central error handler. Express recognises it by its four arguments and
// sends every thrown error here, including ones from async handlers.
// Every error response has the same shape: { error: "message" }, plus
// `fields` for validation errors.
// Stack traces are only logged on the server, never sent to the client.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, fields: error.fields })
    return
  }

  // express.json() throws errors with a 4xx `status`, e.g. for malformed JSON.
  if (typeof error?.status === 'number' && error.status >= 400 && error.status < 500) {
    res.status(error.status).json({ error: 'Invalid request body' })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}
