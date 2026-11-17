import bcrypt from 'bcryptjs'

// Cost factor: each +1 doubles the time to hash. 12 takes a fraction of a
// second, which is fine for logins but slow for anyone guessing passwords.
const SALT_ROUNDS = 12

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}
