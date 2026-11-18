export type UserRole = 'admin' | 'agent'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface ApiErrorBody {
  error: string
  fields?: Record<string, string[] | undefined>
}
