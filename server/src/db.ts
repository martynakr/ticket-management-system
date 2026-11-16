import mongoose from 'mongoose'

// Log connection changes after startup, e.g. if the MongoDB container stops.
// Mongoose reconnects automatically when the database comes back.
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'))
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'))
mongoose.connection.on('error', (error) => console.error('MongoDB error:', error))

export async function connectToDatabase(uri: string): Promise<void> {
  // Fail after 5s instead of the default 30s if MongoDB isn't reachable,
  // so a stopped Docker container is noticed quickly.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  console.log(`MongoDB connected to "${mongoose.connection.name}"`)
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect()
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected
}
