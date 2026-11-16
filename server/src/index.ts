import app from './app.js'
import { connectToDatabase, disconnectFromDatabase } from './db.js'

const PORT = Number(process.env.PORT ?? 3000)
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

try {
  // Connect before accepting requests, so the API never runs without a database.
  await connectToDatabase(MONGODB_URI)
} catch (error) {
  console.error('Could not connect to MongoDB. Is the Docker container running?', error)
  process.exit(1)
}

const server = app.listen(PORT, (error) => {
  if (error) throw error
  console.log(`Server running on http://localhost:${PORT}`)
})

// On Ctrl+C (SIGINT) or a stop signal (SIGTERM), stop taking requests
// and close the database connection before exiting.
async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`)
  server.close()
  await disconnectFromDatabase()
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
