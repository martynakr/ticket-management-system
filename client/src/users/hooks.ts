import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { User } from '../types/api'

export const usersKey = ['users'] as const

export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateUserInput) => api.post<{ user: User }>('/api/users', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  })
}
