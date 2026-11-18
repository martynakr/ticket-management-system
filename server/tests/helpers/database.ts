import { MongoMemoryServer } from 'mongodb-memory-server'
import { connectToDatabase, disconnectFromDatabase } from '../../src/db.js'

// Test helper: runs a throwaway MongoDB in memory, so tests never touch
// the Docker database and each test file starts from an empty database.

let mongo: MongoMemoryServer | undefined

export async function startTestDatabase(): Promise<void> {
  // Same MongoDB version as the Docker container in compose.yaml.
  mongo = await MongoMemoryServer.create({ binary: { version: '8.0.38' } })
  await connectToDatabase(mongo.getUri('ticket-management-test'))
}

export async function stopTestDatabase(): Promise<void> {
  await disconnectFromDatabase()
  await mongo?.stop()
}
