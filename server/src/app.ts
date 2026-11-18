import cookieParser from 'cookie-parser'
import express from 'express'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import authRouter from './routes/auth.js'
import healthRouter from './routes/health.js'
import protectedRouter from './routes/protected.js'

// Kept separate from index.ts so tests can import it without opening a port.
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/protected', protectedRouter)

// Must stay after the routes.
app.use(notFoundHandler)
app.use(errorHandler)

export default app
