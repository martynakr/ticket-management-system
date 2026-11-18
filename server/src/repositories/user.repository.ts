import { UserModel, type UserDocument } from '../models/user.js'

export function findById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id).exec()
}

// Only for login: includes the normally hidden passwordHash.
export function findByEmailWithPassword(email: string): Promise<UserDocument | null> {
  return UserModel.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash').exec()
}
