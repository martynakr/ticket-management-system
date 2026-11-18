import { UserModel, type UserDocument, type UserRole } from '../models/user.js'

export function findById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id).exec()
}

// Only for login: includes the normally hidden passwordHash.
export function findByEmailWithPassword(email: string): Promise<UserDocument | null> {
  return UserModel.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash').exec()
}

export async function incrementTokenVersion(id: string): Promise<void> {
  await UserModel.updateOne({ _id: id }, { $inc: { tokenVersion: 1 } }).exec()
}

export async function existsByEmail(email: string): Promise<boolean> {
  return (await UserModel.exists({ email: email.toLowerCase().trim() })) !== null
}

export function create(data: {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdBy: string
}): Promise<UserDocument> {
  return UserModel.create(data)
}
