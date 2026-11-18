import { hashPassword } from '../auth/password.js'
import { HttpError } from '../errors/http-error.js'
import { toPublicUser, type PublicUser } from '../models/user.js'
import * as userRepository from '../repositories/user.repository.js'
import type { CreateUserInput } from '../schemas/user.schema.js'

export async function createAgent(input: CreateUserInput, createdBy: string): Promise<PublicUser> {
  if (await userRepository.existsByEmail(input.email)) {
    throw new HttpError(409, 'A user with this email already exists')
  }

  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    // Always an agent: admins can't be created through the API.
    role: 'agent',
    createdBy,
  })

  return toPublicUser(user)
}
