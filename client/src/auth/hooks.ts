import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '../lib/api'
import type { User } from '../types/api'

const currentUserKey = ['auth', 'me'] as const

interface LoginInput {
  email: string
  password: string
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { user } = await api.get<{ user: User }>('/api/auth/me')
    return user
  } catch (error) {
    // Not being logged in is a normal state, not an error.
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: fetchCurrentUser,
    // Only login and logout change the user, and they update the cache themselves.
    staleTime: Infinity,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: LoginInput) => api.post<{ user: User }>('/api/auth/login', input),
    onSuccess: ({ user }) => queryClient.setQueryData(currentUserKey, user),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post<void>('/api/auth/logout'),
    // Clear even if the request fails, so the UI never shows a stale session,
    // and drop all cached data so the next user can't see the previous user's.
    onSettled: () => {
      queryClient.setQueryData(currentUserKey, null)
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== currentUserKey[0] })
    },
  })
}
