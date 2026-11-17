import request from 'supertest'
import app from '../app.js'
import { hashPassword } from '../auth/password.js'
import { UserModel } from '../models/user.js'
import { startTestDatabase, stopTestDatabase } from '../test/database.js'

describe('POST /api/auth/login', () => {
  const email = 'admin@example.com'
  const password = 'correct-password'

  beforeAll(async () => {
    await startTestDatabase()
    await UserModel.create({
      name: 'Admin',
      email,
      passwordHash: await hashPassword(password),
      role: 'admin',
    })
  })
  afterAll(stopTestDatabase)

  it('logs in with valid credentials and sets an httpOnly cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password })

    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ name: 'Admin', email, role: 'admin' })
    expect(res.body.user).not.toHaveProperty('passwordHash')

    const cookie = res.headers['set-cookie']?.[0] ?? ''
    expect(cookie).toMatch(/^token=/)
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Strict')
  })

  it('accepts the email in any case and with surrounding spaces', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '  ADMIN@example.com ', password })

    expect(res.status).toBe(200)
  })

  it('returns 401 for a wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Invalid email or password' })
    expect(res.headers['set-cookie']).toBeUndefined()
  })

  it('returns the same 401 for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Invalid email or password' })
  })

  it('returns 400 with a message per field when the body is empty', async () => {
    const res = await request(app).post('/api/auth/login').send({})

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      error: 'Invalid input',
      fields: { email: ['Email is required'], password: ['Password is required'] },
    })
  })

  it('returns 400 for an invalid email or empty password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: '' })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({
      email: ['Enter a valid email'],
      password: ['Password is required'],
    })
  })

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ not json')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body' })
  })
})
