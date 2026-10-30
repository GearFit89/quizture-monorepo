// import redis from "@/redis";
import { getTBQNCacheKey } from '@/redis/key-setter'

const redis = {} as any // TODO Add redis
export const materialInputRegex =
  /<input\s+type=["']checkbox["']\s+name=["']material\[\]["']\s+value=["'](\d+)["']\s*>(\d+)\s-\s(\d+)/g
export const questionRegex =
  /<div\s+id="text_increase_decrease_(\d+)_(\d+)"[^>]*>([^<]*)/g

export const BASE_URL = process.env.TBQN_BASE_URL

interface TBQNQuestion {
  question: string;
  answer: string;
  ref: string;
  flight: string;
}
type TBQNFlight = 'A' | 'B' | 'C' | 'T'
type TBQNQuestionType = 'question' | 'verse'
type TBQNSortBy = 'reference' | 'flight' | 'question' | 'answer'
type TBQNPath = 'print_questions.php' | 'create_quiz.php'
type TBQNSubmit = 'Print'

const sortBys: TBQNSortBy[] = ['reference', 'flight', 'question', 'answer']
const questionTypes: TBQNQuestionType[] = ['question', 'verse']

export interface TBQNParams {
  flights: TBQNFlight[];
  questionType: TBQNQuestionType;
  materialNumbers: number[];
  sortBy: TBQNSortBy;
  submit: TBQNSubmit;
}
/**
 * Fetches raw html from a local Bible Quiz site for question data.
 *
 * Doesn't log errors
 *
 * @param path The page for which data is needed.
 *  /print_questions gives direct questions, and /create_quiz returns a generated quiz
 * @param params The search params that filters questions in this site
 * @returns Raw HTML for scraping
 *
 */
export async function fetchTBQNcontent (
  path: TBQNPath = 'print_questions.php',
  params: TBQNParams
) {
  try {
    const url = new URL(path, BASE_URL)

    // Setup array queries
    params.flights.forEach((flight) => {
      url.searchParams.append('flight[]', flight)
    })
    params.materialNumbers.forEach((materialNum) => {
      url.searchParams.append('material[]', String(materialNum))
    })

    // The original params were numbers, so we map the string value to the index the php recongizes
    url.searchParams.set('sort', String(sortBys.indexOf(params.sortBy)))
    url.searchParams.set(
      'question_type',
      String(questionTypes.indexOf(params.questionType))
    )
    url.searchParams.set('submit', params.submit)

    process.env.NODE_ENV !== 'production' && console.debug('[TBQN_SCRAPER]: URL ', url.href) // TODO: ADD pinto logging

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('Response is not ok')
    }

    const data = await res.text()

    if (!data) {
      throw new Error('Data is empty')
    }

    return {
      success: true as const,
      data: {
        html: data,
      },
    }
  } catch (e: any) {
    return {
      success: false as const,
      error: `[TBQN_SCRAPER]: ${e.message}`,
    }
  }
}
export const defaultTBQNParams: TBQNParams = {
  flights: ['A', 'B', 'C', 'T'],
  materialNumbers: [63, 64, 65, 66, 67, 68],
  questionType: 'question',
  sortBy: 'reference',
  submit: 'Print',
}

export async function getTBQNQuestions (params: Partial<TBQNParams>) {
  try {
    const { data, success, error } = await fetchTBQNcontent(
      'print_questions.php',
      { ...defaultTBQNParams, ...params }
    )

    if (!success) {
      throw new Error(error)
    }

    const html = data.html

    // Grab the matches and remove the iterator
    const matches = [...html.matchAll(questionRegex)]

    const questions = matches.reduce<Record<string, TBQNQuestion>>(
      (acc, match) => {
        const fieldType = match[1]
        const id = match[2]
        const data = match[3]

        if (!acc[id]) {
          // Set the empty object if not there.
          acc[id] = {} as TBQNQuestion // So that typescript doesn't throw a type error
        }

        if (fieldType === '1') acc[id].ref = data
        if (fieldType === '2') acc[id].flight = data
        if (fieldType === '3') acc[id].question = data
        if (fieldType === '4') acc[id].answer = data

        return acc
      },
      {}
    )

    return {
      success: true,
      data: questions,
    }
  } catch (e: any) {
    console.error(e.message)
    return {
      error: e.message,
      success: false,
    }
  }
}

export const materialMap = [
  [10, 11, 12, 13, 14, 15],
  [16, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32],
  [33, 34, 35, 36, 37, 38],
  [39, 40, 41, 42, 43, 44],
  [4, 5, 6, 7, 8, 9],
  [45, 46, 47, 48, 49, 50],
  [51, 52, 53, 54, 55, 56],
  [57, 58, 59, 60, 61, 62],
  [63, 64, 65, 66, 67, 68],
]
/**
 *   Return the index asked, or the last element in the array
 * @param index The index of material map, meaning the material index array wanted
 * @returns
 */
async function getMaterialMap (index: number): Promise<{
  material: number[];
  length: number;
}> {
  // Return the index asked, or the last element in the array
  return {
    material: materialMap[index] ?? materialMap[materialMap.length - 1],
    length: materialMap.length,
  }
  // TODO Add this materialMap to redis stroage
}
/**
 *
 * @param materialIndex
 * @param month A number 0-5,represents the months from oct-march.
 * Also can be "all", which grabs all months.
 */
export async function cacheTBQNData (
  materialIndex: number,
  month: number | 'all'
) {
  const { material, length } = await getMaterialMap(materialIndex)

  // If the month is the last in the array, it will be updated more.
  // Therefore redis save everything esle as the whole data.
  // The last index will be updated more, because the site only updates the
  // current season's material
  const filterKey = materialIndex >= length - 1 ? month : 'all'
  const materialNumbers =
    filterKey === 'all' ? material : [material[filterKey]]
  const redisKey = getTBQNCacheKey(materialIndex, filterKey)

  const cache = await redis.get(redisKey)

  if (!cache) {
    const { success, data, error } = await getTBQNQuestions({
      materialNumbers,
    })

    if (success) {
      await redis.set(redisKey, JSON.stringify(data), 'EX', 24 * 60 * 60) // One day
    }

    return {
      success,
      error,
      isCachedMissed: true,
      data,
    }
  }

  return {
    success: true,
    isCachedMissed: false,
    data: JSON.parse(cache),
  }
}
