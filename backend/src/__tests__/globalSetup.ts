import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

export default async function globalSetup() {
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()
  process.env.JWT_SECRET = 'test_secret_key_for_testing'
  ;(global as any).__MONGOSERVER__ = mongoServer
}
