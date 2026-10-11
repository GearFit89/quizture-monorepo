import { Options, AnswerReturn } from '../types'
import AnswerLogic from '@/services/answer-logic' // Move your CheckAns class here

export class AnswerService {
  static checkAnswer (
    correct: string,
    entered: string,
    options?: Partial<Options>
  ): AnswerReturn {
    const defaults = {
      spellThreshold: 2,
      closeThreshold: 2,
      extraThreshold: 2,
      correction: true,
      isQuote: false,
    }

    return AnswerLogic.checkAnswer(correct, entered, { ...defaults, ...options })
  }

  static stripChar (input: string | string[], includeNumbers = false): string | string[] {
    return AnswerLogic.stripChar(input, includeNumbers)
  }
}
