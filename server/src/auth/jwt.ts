import jwt from 'jsonwebtoken'

export interface TokenPayload {
  userId: string
  // Compared with the user's current tokenVersion, so logout can revoke old tokens.
  tokenVersion: number
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET in .env')
  return secret
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { algorithm: 'HS256', expiresIn: '1d' })
}

// Throws if the token is expired, tampered with, or signed with another secret.
export function verifyToken(token: string): TokenPayload {
  // Pinning the algorithm stops a token from choosing a weaker one for itself.
  return jwt.verify(token, getSecret(), { algorithms: ['HS256'] }) as TokenPayload
}
