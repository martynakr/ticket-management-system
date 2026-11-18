import request from 'supertest'
import app from '../src/app.js'
import { createTestUser, loginAs } from './helpers/auth.js'
import { startTestDatabase, stopTestDatabase } from './helpers/database.js'

describe('GET /api/auth/me', () => {
  const email = 'agent@example.com'
  const password = 'correct-password'

  beforeAll(async () => {
    await startTestDatabase()
    await createTestUser(email, password, 'agent')
  })
  afterAll(stopTestDatabase)

  it('returns the current user without the password hash', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', await loginAs(email, password))

    expect(res.status).toBe(200)
    expect(res.body.user).toEqual({ id: expect.any(String), name: 'Agent', email, role: 'agent' })
  })

  it('returns 401 when not logged in', async () => {
    const res = await request(app).get('/api/auth/me')

    expect(res.status).toBe(401)
  })

  it('returns 401 after logout', async () => {
    const cookie = await loginAs(email, password)
    await request(app).post('/api/auth/logout').set('Cookie', cookie)

    const res = await request(app).get('/api/auth/me').set('Cookie', cookie)

    expect(res.status).toBe(401)
  })
})
