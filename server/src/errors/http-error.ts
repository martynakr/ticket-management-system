// An error with an HTTP status code. Throw it from any layer (controller,
// service) and the error handler turns it into a JSON response.
// `fields` holds per-field messages for validation errors (see validate.ts).
export class HttpError extends Error {
  readonly status: number
  readonly fields?: Record<string, string[] | undefined>

  constructor(status: number, message: string, fields?: Record<string, string[] | undefined>) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.fields = fields
  }
}
