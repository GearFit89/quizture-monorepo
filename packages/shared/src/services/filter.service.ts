import type {
  Question,
  FilterCriteria,
  BibleKey,
  BookRange,
  BaseQuestion,
} from '../types'
import { extractRefObject } from '../utils'

/**
 *
 * @param items
 * @param criteria
 * @param shoulIncludeMissingKeys If the item is null or undefined it will be
 * added if this is true or not if not false.  It also uses falsey checks on each item
 * @returns The filtered array, or if undefined it returns the original items.
 * Returns [] if no item passes.
 */

export function multiQuestionFilter<
  T extends BaseQuestion
> (
  items: T[],
  criteria: Partial<FilterCriteria<Partial<Record<keyof T, string | undefined | null>>>>,
  shoulIncludeMissingKeys: boolean = false
): T[] {
  if (!items || !criteria) return items

  const bookRange = (criteria.bookRange ?? {}) as BookRange
  const includedBooks = new Set(Object.keys(bookRange))

  return items.filter((item) => {
    return Object.keys(criteria).every((key) => {
      const itemVal = item[key as keyof BaseQuestion]

      const criteriaVal = criteria[key as keyof BaseQuestion] as string[]

      if (key === 'bookRange') {
        return checkBookRanage(bookRange, item, includedBooks)
      }
      if (criteriaVal.length === 0) return true
      if (!itemVal) {
        // console.debug("wretrun here", itemVal, criteriaVal)
        return shoulIncludeMissingKeys
      }
      // console.debug("retrun hereww, ", criteriaVal.includes(itemVal as never))
      return criteriaVal.includes(itemVal as never)
    })
  })
}

function checkBookRanage (
  bookRange: BookRange,
  item: BaseQuestion,
  includedBooks: Set<string>
) {
  // If book range doesn't exit, then the item passes
  if (!bookRange) return true

  let chapter = item.chapter
  let book = item.book

  if (!book || !chapter) {
    try {
      const refObject = extractRefObject((item as any)?.ref ?? '')
      book = refObject.book
      chapter = refObject.chapter
    } catch {
      return false
    }
  }
  if (!includedBooks.has(book)) {
    // console.debug("retrun here")

    return false
  }

  const allowedChapters = bookRange[book as BibleKey]

  // // If the book exists, but the chapter array is set explictly to "*", then it passes.
  // if( allowedChapters === "*"){
  //   return true;
  // }
  // If the book exists, but the chapter array doesn't have anything, it won't pass.
  if (!allowedChapters || allowedChapters.length === 0) {
    // console.debug("retrun here2")
    return false // TODO: figure this out
  }

  const includedChapters = new Set(allowedChapters)

  // console.debug("retrun here3", includedChapters.has(chapter))
  return includedChapters.has(chapter)
}
