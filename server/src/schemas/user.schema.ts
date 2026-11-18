import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string({ error: 'Name is required' }).trim().min(1, 'Name is required').max(100),
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email' })),
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    // bcrypt ignores everything after 72 bytes.
    .max(72, 'Password must be at most 72 characters'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
