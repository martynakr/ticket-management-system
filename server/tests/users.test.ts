import request from 'supertest'
import app from '../src/app.js'
import { UserModel } from '../src/models/user.js'
import { createTestUser, loginAs } from './helpers/auth.js'
import { startTestDatabase, stopTestDatabase } from './helpers/database.js'

describe('POST /api/users', () => {
  const password = 'correct-password'
  let adminCookie: string
  let agentCookie: string

  beforeAll(async () => {
    await startTestDatabase()
    await createTestUser('admin@example.com', password, 'admin')
    await createTestUser('agent@example.com', password, 'agent')
    adminCookie = await loginAs('admin@example.com', password)
    agentCookie = await loginAs('agent@example.com', password)
  })
  afterAll(stopTestDatabase)

  const newAgent = { name: 'New Agent', email: 'new@example.com', password: 'new-agent-password' }

  it('lets an admin create an agent who can then log in', async () => {
    const res = await request(app).post('/api/users').set('Cookie', adminCookie).send(newAgent)

    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({ name: 'New Agent', email: 'new@example.com', role: 'agent' })
    expect(res.body.user).not.toHaveProperty('passwordHash')

    const admin = await UserModel.findOne({ email: 'admin@example.com' })
    const created = await UserModel.findOne({ email: 'new@example.com' })
    expect(created?.createdBy?.toString()).toBe(admin?.id)

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: newAgent.email, password: newAgent.password })
    expect(login.status).toBe(200)
  })

  it('always creates an agent, even if the body asks for admin', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Cookie', adminCookie)
      .send({ name: 'Sneaky', email: 'sneaky@example.com', password: 'sneaky-password', role: 'admin' })

    expect(res.status).toBe(201)
    expect(res.body.user.role).toBe('agent')
  })

  it('returns 409 for a duplicate email, in any case', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Cookie', adminCookie)
      .send({ ...newAgent, email: 'NEW@example.com' })

    expect(res.status).toBe(409)
    expect(res.body).toEqual({ error: 'A user with this email already exists' })
  })

  it('returns 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Cookie', adminCookie)
      .send({ name: '', email: 'not-an-email', password: 'short' })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({
      name: ['Name is required'],
      email: ['Enter a valid email'],
      password: ['Password must be at least 8 characters'],
    })
  })

  it('returns 403 for an agent', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Cookie', agentCookie)
      .send({ ...newAgent, email: 'other@example.com' })

    expect(res.status).toBe(403)
    expect(res.body).toEqual({ error: 'Admin access required' })
  })

  it('returns 401 when not logged in', async () => {
    const res = await request(app).post('/api/users').send(newAgent)

    expect(res.status).toBe(401)
  })
})
