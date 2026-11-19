import { z } from 'zod'

// Mirrors the server's rules, so most mistakes are caught before a request.
export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Enter a valid email')),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
})

export type CreateUserForm = z.infer<typeof createUserSchema>
