import request from 'supertest'
import app from '../src/app.js'
import { UserModel } from '../src/models/user.js'
import { createTestUser, loginAs } from './helpers/auth.js'
import { startTestDatabase, stopTestDatabase } from './helpers/database.js'

describe('GET /api/protected', () => {
  const email = 'agent@example.com'
  const password = 'correct-password'

  beforeAll(async () => {
    await startTestDatabase()
    await createTestUser(email, password, 'agent')
  })
  afterAll(stopTestDatabase)

  it('returns the message when logged in', async () => {
    const res = await request(app).get('/api/protected').set('Cookie', await loginAs(email, password))

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'You see this because you are logged in, Agent' })
  })

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/protected')

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Not authenticated' })
  })

  it('returns 401 for an invalid token', async () => {
    const res = await request(app).get('/api/protected').set('Cookie', 'token=not-a-real-jwt')

    expect(res.status).toBe(401)
  })

  it('returns 401 for a token with an outdated tokenVersion', async () => {
    const cookie = await loginAs(email, password)
    // Simulates a logout, which bumps tokenVersion.
    await UserModel.updateOne({ email }, { $inc: { tokenVersion: 1 } })

    const res = await request(app).get('/api/protected').set('Cookie', cookie)

    expect(res.status).toBe(401)
  })
})
