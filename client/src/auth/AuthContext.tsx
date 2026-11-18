import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError } from '../lib/api'
import type { User } from '../types/api'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ user: User }>('/api/auth/me')
      .then(({ user }) => setUser(user))
      .catch((error) => {
        if (!(error instanceof ApiError && error.status === 401)) console.error(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { user } = await api.post<{ user: User }>('/api/auth/login', { email, password })
    setUser(user)
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout')
    } finally {
      // Clear locally even if the request fails, so the UI never shows a stale session.
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
  )
}

// Fast Refresh only reloads files that export components; this hook belongs with its provider.
// oxlint-disable-next-line react/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
