import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  defaultTBQNParams,
  fetchTBQNcontent,
  getTBQNQuestions,
} from '../src/scraper'
import { materialMap } from '@/scraper/scraper'
import redis, { redisSubClient } from '@/redis'

console.log('NODE_ENV', process.env.NODE_ENV)

export async function fetchExampleData () {
  const response = await fetch('https://example.com/api/data')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

describe('redis_connection', () => {
  beforeEach(() => {
    // Reset or setup global stubs before each test
    vi.restoreAllMocks()
  })

  afterEach(() => {
    // Clean up stubs after each test run
    vi.unstubAllGlobals()
  })

  it('REDIS_CONNect', async () => {
    await redis.set('io', 'hello')

    const gotKey = await redis.get('io')

    redisSubClient.on('message', (channel: string, message: string) => {
      if (channel === 'io') {
        console.log(`Received message on channel '${channel}':`, message)
        expect(channel).toBe('io')
        expect(message).toBe('hello')
      }
    })

    // 2. Subscribe to the channel
    await redisSubClient.subscribe('io')

    await redis.publish('io', 'hello')
    expect(gotKey).toBe('hello')
    console.log(gotKey)
  })
})
