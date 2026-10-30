import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  defaultTBQNParams,
  fetchTBQNcontent,
  getTBQNQuestions,
} from '../src/scraper'
import { materialMap } from '@/scraper/scraper'
import redis, { redisSubClient } from '@/redis'
import { logger } from '@/logger' // Import Pino logger

describe('redis_connection', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('REDIS_CONNect', async () => {
    logger.info('Starting Redis connection and Pub/Sub test')

    // Standard set/get verification
    await redis.set('io', 'hello')
    const gotKey = await redis.get('io')

    logger.info({ gotKey }, 'Retrieved key value from Redis')
    expect(gotKey).toBe('hello')

    // Wrap the Pub/Sub message handling in a Promise to prevent race conditions
    const messagePromise = new Promise<{ channel: string; message: string }>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout waiting for Redis Pub/Sub message'))
      }, 5000)

      redisSubClient.on('message', (channel: string, message: string) => {
        clearTimeout(timer)
        logger.info({ channel, message }, 'Received message on Redis subscriber')
        resolve({ channel, message })
      })
    })

    // 1. Subscribe to the channel
    await redisSubClient.subscribe('io')
    logger.info("Subscribed to channel 'io'")

    // 2. Publish message
    await redis.publish('io', 'hello')
    logger.info("Published message 'hello' to channel 'io'")

    // 3. Await the received message promise
    const received = await messagePromise

    // Assert on the promise result cleanly
    expect(received.channel).toBe('io')
    expect(received.message).toBe('hello')

    // Cleanup subscription
    await redisSubClient.unsubscribe('io')
  })
})
