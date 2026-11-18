import jwt from 'jsonwebtoken'

export interface TokenPayload {
  userId: string
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

export function verifyToken(token: string): TokenPayload {
  // Pin the algorithm so a forged token can't pick a weaker one.
  return jwt.verify(token, getSecret(), { algorithms: ['HS256'] }) as TokenPayload
}
