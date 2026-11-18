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
