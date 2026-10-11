import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defaultTBQNParams, fetchTBQNcontent, getTBQNQuestions } from '../src/scraper'
import { materialMap } from '@/scraper/scraper'
import { getTBQNCacheKey } from '@/redis/key-setter'
import { writeFileSync } from 'fs'

console.log('NODE_ENV', process.env.NODE_ENV)

export async function fetchExampleData () {
  const response = await fetch('https://example.com/api/data')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

describe('fetchTBQNData', () => {
  beforeEach(() => {
    // Reset or setup global stubs before each test
    vi.restoreAllMocks()
  })

  afterEach(() => {
    // Clean up stubs after each test run
    vi.unstubAllGlobals()
  })

  it('REturn data', async () => {
    const { data, success, error } = await getTBQNQuestions({
      materialNumbers: materialMap[materialMap.length - 1],
      questionType: 'question',
      submit: 'Print'
    })

    if (!success) throw new Error('no scuccess')
    console.log('success', success, error, '\n')
    // console.log("data\n", JSON.stringify(data, null, 2))

    console.log('length', Object.keys(data ?? {}).length)
    console.log(getTBQNCacheKey(9, 'all'))
    console.log(getTBQNCacheKey(4, 3))

    writeFileSync('json', JSON.stringify(data, null, 2))
  })
})
