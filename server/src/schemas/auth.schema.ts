import { z } from 'zod'

export const loginSchema = z.object({
  // Normalise before the format check, so " Admin@Example.com " matches the stored email.
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email' })),
  // No length rule: that's enforced when the account is created.
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
