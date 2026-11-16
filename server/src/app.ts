import express from 'express'
import healthRouter from './routes/health.js'

// The app is built separately from index.ts so tests can import it
// without starting a real server.
const app = express()

app.use('/api/health', healthRouter)

export default app
