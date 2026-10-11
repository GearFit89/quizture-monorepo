import { describe, it, expect } from 'vitest'
import { multiQuestionFilter } from '@bq/shared/services'
import type { Question, BookRange } from '@bq/shared/src/types'

// Mock dataset (10 questions, all Matthew chapter 28, type "question")
export const mockQuestions: Question[] = [
  {
    id: 1238,
    book: 'Matthew',
    chapter: '28',
    verse: '8',
    flight: 'A',
    month: 'march',
    type: 'question',
    question: 'Who departed quickly from the tomb with fear and great joy?',
    answer: 'The women (Mary Magdalene and the other Mary)',
    difficulty: 1,
  },
  {
    id: 1239,
    book: 'Matthew',
    chapter: '28',
    verse: '9',
    flight: 'T',
    month: 'march',
    type: 'question',
    question: 'Who met the women?',
    answer: 'Jesus',
    difficulty: 1,
  },
  {
    id: 1240,
    book: 'Matthew',
    chapter: '28',
    verse: '9',
    flight: 'C',
    month: 'march',
    type: 'question',
    question: 'SQ: Who said it and to whom was it said, "Greetings!"',
    answer: 'Jesus said it to the women (Mary Magdalene and the other Mary)',
    difficulty: 2,
  },
  {
    id: 1241,
    book: 'Matthew',
    chapter: '28',
    verse: '9',
    flight: 'A',
    month: 'march',
    type: 'question',
    question: 'SQ: Who said it, to whom was it said and what happened, "Greetings!"',
    answer: 'Jesus said it to the women (Mary Magdalene and the other Mary). They came up and took hold of his feet and worshiped him.',
    difficulty: 3,
  },
  {
    id: 1242,
    book: 'Matthew',
    chapter: '28',
    verse: '10',
    flight: 'T',
    month: 'march',
    type: 'question',
    question: 'SQ: Who said it and to whom was it said, "Do not be afraid, go and tell my brothers to go to Galilee, and there they will see me."',
    answer: 'Jesus said it to the women (Mary Magdalene and the other Mary)',
    difficulty: 2,
  },
  {
    id: 1243,
    book: 'Matthew',
    chapter: '28',
    verse: '10',
    flight: 'A',
    month: 'march',
    type: 'question',
    question: 'According to Matthew 28:10, who are not to be afraid?',
    answer: 'The women (Mary Magdalene and the other Mary)',
    difficulty: 1,
  },
  {
    id: 1244,
    book: 'Matthew',
    chapter: '28',
    verse: '11',
    flight: 'T',
    month: 'march',
    type: 'question',
    question: 'When did some of the guards go into the city and tell the chief priests all that had taken place?',
    answer: 'While they (the women) were going',
    difficulty: 2,
  },
  {
    id: 1245,
    book: 'Matthew',
    chapter: '28',
    verse: '11-12',
    flight: 'T',
    month: 'march',
    type: 'question',
    question: 'When did the chief priests give a sufficient sum of money to the soldiers?',
    answer: 'When they had assembled with the elders and taken counsel',
    difficulty: 3,
  },
  {
    id: 1246,
    book: 'Matthew',
    chapter: '28',
    verse: '12',
    flight: 'C',
    month: 'march',
    type: 'question',
    question: 'To whom did the chief priests give a sufficient sum of money?',
    answer: 'The soldiers',
    difficulty: 1,
  },
  {
    id: 1247,
    book: 'Matthew',
    chapter: '28',
    verse: '13',
    flight: 'A',
    month: 'march',
    type: 'quote',
    question: 'What were the soldiers to tell the people?',
    answer: 'His disciples came by night and stole him away while we were asleep',
    difficulty: 2,
  },
]

describe('multiQuestionFilter', () => {
  it('1. Should return input items or null safely when items or criteria are missing', () => {
    // @ts-expect-error testing runtime null safety
    expect(multiQuestionFilter(null, { type: ['question'] })).toBeNull()
    // @ts-expect-error testing runtime null safety
    expect(multiQuestionFilter(mockQuestions, null)).toEqual(mockQuestions)
  })

  it('2. Should filter items using single or multiple array criteria (flight)', () => {
    // Single flight criterion ['C'] -> Should return 2 questions (1240, 1246)
    const flightCResult = multiQuestionFilter(mockQuestions, { flight: ['C'] })
    expect(flightCResult).toHaveLength(2)
    expect(flightCResult.map((q) => q.id)).toEqual([1240, 1246])

    // Multiple flight criteria ['T', 'C'] -> Should return 6 questions (4 'T' + 2 'C')
    const flightTCResult = multiQuestionFilter(mockQuestions, {
      flight: ['T', 'C'],
    })
    expect(flightTCResult).toHaveLength(6)
    expect(flightTCResult.map((q) => q.id)).toEqual([
      1239, 1240, 1242, 1244, 1245, 1246,
    ])
  })

  it('3. Should ignore inactive/empty array criteria (month: [])', () => {
    const result = multiQuestionFilter(mockQuestions, {
      month: [],
      flight: ['A'],
    })

    // month: [] should not filter everything out; flight: ["A"] matches 4 items
    expect(result).toHaveLength(4)
    expect(result.map((q) => q.id)).toEqual([1238, 1241, 1243, 1247])
  })

  it('4. Should handle missing properties based on shouldIncludeMissingKeys flag', () => {
    // Create an item missing the 'flight' property
    const questionsWithMissingField: Question[] = [
      ...mockQuestions,
      {
        id: 9999,
        book: 'Matthew',
        chapter: '28',
        verse: '14',
        // 'flight' property is intentionally omitted
        month: 'march',
        type: 'question',
        question: "And if this comes to the governor's ears?",
        answer: 'We will satisfy him and keep you out of trouble.',
      },
    ]

    const criteria = { flight: ['A'] }

    // Default (false): Exclude items where the target property is missing
    const excludeMissing = multiQuestionFilter(
      questionsWithMissingField,
      criteria,
      false
    )
    expect(excludeMissing).toHaveLength(4)

    // True: Include items where the target property is missing
    const includeMissing = multiQuestionFilter(
      questionsWithMissingField,
      criteria,
      true
    )
    expect(includeMissing).toHaveLength(5)
    expect(includeMissing.map((q) => q.id)).toContain(9999)
  })

  it('5. Should filter accurately using bookRange configuration', () => {
    // Only include Matthew Chapter 28
    const matthewRange: BookRange = {
      Matthew: ['28'],
    }

    const matthewResult = multiQuestionFilter(mockQuestions, {
      bookRange: matthewRange,
    })
    expect(matthewResult).toHaveLength(10)

    // Book not present in mock dataset (Mark)
    const markRange: BookRange = {
      Mark: ['16'],
    }

    const markResult = multiQuestionFilter(mockQuestions, {
      bookRange: markRange,
    })
    expect(markResult).toHaveLength(0)

    const nullRange: BookRange = {
      Matthew: [],
    }
    const nullResult = multiQuestionFilter(mockQuestions, {
      bookRange: nullRange
    })
    expect(nullResult).toHaveLength(0)
  })
  it('App filters should work', () => {
    const results = multiQuestionFilter(mockQuestions, {
      month: [
        'october',
        'november',
        'december',
        'january',
        'february',
        'march'
      ],
      bookRange: { Matthew: ['28'] },
      type: [
        'quote',
        'ftv',
        'According to',
        'question',
        'SQ:'
      ],
      flight: [
        'A',
        'B',
        'C',
        'T'
      ]
    })
    expect(results).toHaveLength(10)
    console.debug(results)
  })
})
