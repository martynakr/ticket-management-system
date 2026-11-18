import request from 'supertest'
import app from '../src/app.js'

describe('error responses', () => {
  it('returns a JSON 404 for an unknown route', async () => {
    const res = await request(app).get('/api/does-not-exist')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'Route not found: GET /api/does-not-exist' })
  })

  it('keeps the status and message of other 4xx errors', async () => {
    // express.json() rejects bodies over 100kb.
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ email: 'a'.repeat(200_000) }))

    expect(res.status).toBe(413)
    expect(res.body).toEqual({ error: 'request entity too large' })
  })
})
