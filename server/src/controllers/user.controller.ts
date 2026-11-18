import type { Response } from 'express'
import type { CreateUserInput } from '../schemas/user.schema.js'
import * as userService from '../services/user.service.js'
import type { ValidatedRequest } from '../validation/validate.js'

export async function createUser(req: ValidatedRequest<CreateUserInput>, res: Response): Promise<void> {
  const user = await userService.createAgent(req.body, req.user!.id)

  res.status(201).json({ user })
}
