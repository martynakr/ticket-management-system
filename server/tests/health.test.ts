import request from 'supertest'
import app from '../src/app.js'
import { startTestDatabase, stopTestDatabase } from './helpers/database.js'

describe('GET /api/health', () => {
  beforeAll(startTestDatabase)
  afterAll(stopTestDatabase)

  it('returns 200 and reports the database as connected', async () => {
    // Supertest sends the request to the app directly; no port is opened.
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ status: 'ok', database: 'connected' })
  })
})
