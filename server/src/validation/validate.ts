import { z } from 'zod'
import { HttpError } from '../errors/http-error.js'

// Returns the parsed data (transforms applied, unknown keys stripped),
// or throws a 400 with per-field messages.
export function validate<Schema extends z.ZodType>(schema: Schema, data: unknown): z.output<Schema> {
  // An empty body is undefined; parse {} so each missing field gets its own message.
  const result = schema.safeParse(data ?? {})

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error)
    throw new HttpError(400, 'Invalid input', fieldErrors)
  }

  return result.data
}
