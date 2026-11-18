import mongoose from 'mongoose'

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'))
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'))
mongoose.connection.on('error', (error) => console.error('MongoDB error:', error))

export async function connectToDatabase(uri: string): Promise<void> {
  // Fail fast (default is 30s) so a stopped Docker container is noticed quickly.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  console.log(`MongoDB connected to "${mongoose.connection.name}"`)
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect()
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected
}
