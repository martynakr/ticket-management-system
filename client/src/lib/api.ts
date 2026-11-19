import type { ApiErrorBody } from '../types/api'

export class ApiError extends Error {
  readonly status: number
  readonly fields?: ApiErrorBody['fields']

  constructor(status: number, message: string, fields?: ApiErrorBody['fields']) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server')
  }

  if (res.status === 204) return undefined as T

  // A proxy error (e.g. the API is down) returns a non-JSON body.
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? 'Something went wrong', body?.fields)
  }

  
  return body as T
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: data === undefined ? undefined : JSON.stringify(data) }),
}
