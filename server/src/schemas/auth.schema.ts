import { z } from 'zod'

export const loginSchema = z.object({
  // Trim and lowercase first, then check the format, so " Admin@Example.com "
  // is accepted and matches the email as it's stored.
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email' })),
  // No length rule here: login only checks the password, the rules apply
  // when an account is created.
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
