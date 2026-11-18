import request from 'supertest'
import app from '../../src/app.js'
import { hashPassword } from '../../src/auth/password.js'
import { UserModel, type UserRole } from '../../src/models/user.js'

export async function createTestUser(email: string, password: string, role: UserRole) {
  return UserModel.create({
    name: role === 'admin' ? 'Admin' : 'Agent',
    email,
    passwordHash: await hashPassword(password),
    role,
  })
}

// Returns the auth cookie, ready for .set('Cookie', ...).
export async function loginAs(email: string, password: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password })
  return res.headers['set-cookie']![0]!
}
