import { connectToDatabase, disconnectFromDatabase } from '../db.js'
import { seedAdmin } from './admin.js'

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env')
  process.exit(1)
}

await connectToDatabase(MONGODB_URI)

try {
  await seedAdmin()
  console.log('Seeding complete')
} catch (error) {
  console.error('Seeding failed:', error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await disconnectFromDatabase()
}
