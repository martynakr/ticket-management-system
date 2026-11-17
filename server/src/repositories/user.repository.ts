// Repository layer: the only place that talks to MongoDB about users.
// Services call these functions instead of using UserModel directly, so
// database details (queries, projections) stay in one file.
import { UserModel, type UserDocument } from '../models/user.js'

// Includes passwordHash, which is hidden by default. Only use it for login.
export function findByEmailWithPassword(email: string): Promise<UserDocument | null> {
  return UserModel.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash').exec()
}
