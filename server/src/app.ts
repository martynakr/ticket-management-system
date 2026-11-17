import express from 'express'
import { errorHandler } from './middleware/error-handler.js'
import authRouter from './routes/auth.js'
import healthRouter from './routes/health.js'

// The app is built separately from index.ts so tests can import it
// without starting a real server.
const app = express()

// Parses JSON request bodies into req.body.
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)

// Must come after the routes, so it catches their errors.
app.use(errorHandler)

export default app
