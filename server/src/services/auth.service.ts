// Service layer: the business rules for auth. It knows nothing about HTTP
// requests or cookies (that's the controller) or MongoDB (that's the repository).
import { signToken } from '../auth/jwt.js'
import { verifyPassword } from '../auth/password.js'
import { HttpError } from '../errors/http-error.js'
import { toPublicUser, type PublicUser } from '../models/user.js'
import * as userRepository from '../repositories/user.repository.js'
import type { LoginInput } from '../schemas/auth.schema.js'

// A bcrypt hash of a throwaway password. When the email is unknown we still
// run bcrypt against it, so the response takes as long as a wrong password.
// Otherwise an attacker could tell which emails exist by timing the response.
const DUMMY_HASH = '$2b$12$blQ8nn781IxFaokO6c1BhuyZRvIov8PEkmY.BwhvL4EXiByVn4WfK'

export async function login({
  email,
  password,
}: LoginInput): Promise<{ user: PublicUser; token: string }> {
  const user = await userRepository.findByEmailWithPassword(email)
  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH)

  // Same error for both cases, so the response doesn't reveal whether the email exists.
  if (!user || !passwordMatches) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion })
  return { user: toPublicUser(user), token }
}
