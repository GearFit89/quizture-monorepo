import Redis from 'ioredis'
import ENV from '@/env'

// Enable lazyConnect so importing this module doesn't force an immediate connection
export const redisClient = new Redis(ENV.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
})

export const redisSubClient = redisClient.duplicate()

// Prevent unhandled errors from crashing the Node process
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

// Graceful cleanup on process exit
const shutdown = async () => {
  if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
    await redisClient.quit()
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

export default redisClient
