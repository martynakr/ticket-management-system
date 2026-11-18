import { MongoMemoryServer } from 'mongodb-memory-server'
import { connectToDatabase, disconnectFromDatabase } from '../../src/db.js'

let mongo: MongoMemoryServer | undefined

export async function startTestDatabase(): Promise<void> {
  // Match the version in compose.yaml.
  mongo = await MongoMemoryServer.create({ binary: { version: '8.0.38' } })
  await connectToDatabase(mongo.getUri('ticket-management-test'))
}

export async function stopTestDatabase(): Promise<void> {
  await disconnectFromDatabase()
  await mongo?.stop()
}
