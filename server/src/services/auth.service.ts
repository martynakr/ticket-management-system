import { signToken, verifyToken, type TokenPayload } from '../auth/jwt.js'
import { verifyPassword } from '../auth/password.js'
import { HttpError } from '../errors/http-error.js'
import { toPublicUser, type PublicUser, type UserDocument } from '../models/user.js'
import * as userRepository from '../repositories/user.repository.js'
import type { LoginInput } from '../schemas/auth.schema.js'

// Compared against when the email is unknown, so the response takes as long
// as a wrong password and timing doesn't reveal which emails exist.
const DUMMY_HASH = '$2b$12$blQ8nn781IxFaokO6c1BhuyZRvIov8PEkmY.BwhvL4EXiByVn4WfK'

export async function login({
  email,
  password,
}: LoginInput): Promise<{ user: PublicUser; token: string }> {
  const user = await userRepository.findByEmailWithPassword(email)
  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH)

  if (!user || !passwordMatches) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion })
  return { user: toPublicUser(user), token }
}

// Invalidates every token issued so far, on all devices.
export async function logout(userId: string): Promise<void> {
  await userRepository.incrementTokenVersion(userId)
}

export async function authenticate(token: string | undefined): Promise<UserDocument> {
  if (!token) throw new HttpError(401, 'Not authenticated')

  let payload: TokenPayload
  try {
    payload = verifyToken(token)
  } catch {
    throw new HttpError(401, 'Not authenticated')
  }

  // A tokenVersion mismatch means the user logged out after this token was issued.
  const user = await userRepository.findById(payload.userId)
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new HttpError(401, 'Not authenticated')
  }

  return user
}
