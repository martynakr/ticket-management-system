import request from 'supertest'
import app from '../src/app.js'
import { createTestUser, loginAs } from './helpers/auth.js'
import { startTestDatabase, stopTestDatabase } from './helpers/database.js'

describe('POST /api/auth/logout', () => {
  const email = 'agent@example.com'
  const password = 'correct-password'

  beforeAll(async () => {
    await startTestDatabase()
    await createTestUser(email, password, 'agent')
  })
  afterAll(stopTestDatabase)

  it('clears the cookie', async () => {
    const res = await request(app).post('/api/auth/logout').set('Cookie', await loginAs(email, password))

    expect(res.status).toBe(204)
    const cookie = res.headers['set-cookie']?.[0] ?? ''
    expect(cookie).toMatch(/^token=;/)
    expect(cookie).toContain('Expires=Thu, 01 Jan 1970')
  })

  it('rejects the old token afterwards, even if the client kept a copy', async () => {
    const cookie = await loginAs(email, password)
    await request(app).post('/api/auth/logout').set('Cookie', cookie)

    const res = await request(app).get('/api/protected').set('Cookie', cookie)

    expect(res.status).toBe(401)
  })

  it('also invalidates tokens from other devices', async () => {
    const laptop = await loginAs(email, password)
    const phone = await loginAs(email, password)
    await request(app).post('/api/auth/logout').set('Cookie', laptop)

    const res = await request(app).get('/api/protected').set('Cookie', phone)

    expect(res.status).toBe(401)
  })

  it('lets the user log in again afterwards', async () => {
    const old = await loginAs(email, password)
    await request(app).post('/api/auth/logout').set('Cookie', old)

    const res = await request(app).get('/api/protected').set('Cookie', await loginAs(email, password))

    expect(res.status).toBe(200)
  })

  it('returns 401 when not logged in', async () => {
    const res = await request(app).post('/api/auth/logout')

    expect(res.status).toBe(401)
  })
})
