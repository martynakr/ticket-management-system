import { model, Schema, type HydratedDocument, type InferSchemaType } from 'mongoose'

export const USER_ROLES = ['admin', 'agent'] as const
export type UserRole = (typeof USER_ROLES)[number]

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Hidden from queries unless asked for with .select('+passwordHash').
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, required: true, default: 'agent' },
    // Bumped on logout, which invalidates all older tokens.
    tokenVersion: { type: Number, required: true, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },

  { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>

export const UserModel = model('User', userSchema)

export type UserDocument = HydratedDocument<User>

export interface PublicUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export function toPublicUser(user: UserDocument): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}
