import { z } from 'zod'
import { HttpError } from '../errors/http-error.js'

// Checks `data` against a Zod schema and returns the parsed result, typed from
// the schema. Use it in controllers on req.body, req.query or req.params:
//
//   const { email, password } = validate(loginSchema, req.body)
//
// The result is the *parsed* data, so transforms in the schema (trim,
// toLowerCase, defaults) are applied, and unknown keys are stripped.
// If the data is invalid, it throws a 400 that the error handler sends as:
//
//   { "error": "Invalid input", "fields": { "email": ["Enter a valid email"] } }
export function validate<Schema extends z.ZodType>(schema: Schema, data: unknown): z.output<Schema> {
  // An empty body arrives as undefined. Treat it as {} so the client gets a
  // message per missing field instead of "expected object".
  const result = schema.safeParse(data ?? {})

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error)
    throw new HttpError(400, 'Invalid input', fieldErrors)
  }

  return result.data
}
