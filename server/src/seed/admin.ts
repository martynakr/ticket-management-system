import { hashPassword } from '../auth/password.js'
import { UserModel } from '../models/user.js'

// Creates the first admin account from SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.
// Safe to run more than once: if that admin already exists, it does nothing.
// Expects an open database connection (see seed/index.ts).
export async function seedAdmin(): Promise<void> {
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env

  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    throw new Error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in .env')
  }
  if (SEED_ADMIN_PASSWORD.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters')
  }

  // Wait for the unique email index to exist before inserting.
  await UserModel.init()

  const existing = await UserModel.findOne({ email: SEED_ADMIN_EMAIL.toLowerCase().trim() })
  if (existing) {
    console.log(`Admin ${existing.email} already exists, skipping`)
    return
  }

  const admin = await UserModel.create({
    name: 'Admin',
    email: SEED_ADMIN_EMAIL,
    passwordHash: await hashPassword(SEED_ADMIN_PASSWORD),
    role: 'admin',
  })
  console.log(`Created admin ${admin.email}`)
}
