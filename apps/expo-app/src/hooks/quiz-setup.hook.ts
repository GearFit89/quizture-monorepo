import { Dispatch, SetStateAction, useCallback, useContext, useMemo, useState } from 'react'
import { BookRange, type QuizMode } from '@bq/shared/types'
import type {
  DifficultyLevel,
  AppFilterCriteria,
  BibleKey,
} from '@bq/shared/types'
import { QuizSetupContext } from '@/context'
import { useSetupContent } from '@/hooks'
import { getChapters, BIBLE_BOOKS, getBookRange } from '@bq/shared/utils'

export interface QuizSetupData<Mode_T> {
  id: string;
  quizType: QuizMode; // Named QuizType due to conflicts with quizType in xstate
  mode?: QuizMode | Mode_T;
  difficultyLevel?: DifficultyLevel;
  questionFilters?: AppFilterCriteria;
}

export interface QuizSetupState<Mode_T> {
  data: QuizSetupData<Mode_T>;
  defualtQuizFilters: AppFilterCriteria;
  isQuizValid: boolean;
  minQuizQuestionLength: number,
  setIsQuizVaild: Dispatch<SetStateAction<boolean>>
  setMode: (mode: Mode_T) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  updateData: (newData: Partial<QuizSetupData<Mode_T>>) => void;
  updateBibleRef: (
    bibleKey: BibleKey,
    value: AppFilterCriteria['bookRange'][BibleKey],
  ) => void;
  // setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  updateFilterCriteria: <K extends keyof AppFilterCriteria>(
    key: K,
    value: AppFilterCriteria[K],
  ) => void;
}
export interface QuizSetupStateArgs<Mode_T> {
  initialMode: Mode_T;
  quizType: QuizMode;
  id: string;
  minQuizQuestionLength: number
}

export function useQuizSetupState<Mode_T> ({
  quizType,
  initialMode,
  id,
  minQuizQuestionLength
}: QuizSetupStateArgs<Mode_T>): QuizSetupState<Mode_T> {
  const { filterSection } = useSetupContent()

  const defualtQuizFilters: AppFilterCriteria = useMemo(() => ({
    month: filterSection.months.options.map(o => o.value),
    bookRange: getBookRange,
    type: filterSection.questionType.options.map(o => o.value),

    flight: filterSection.flight.options.map(o => o.value)
  }), [])

  const [data, setData] = useState<QuizSetupData<Mode_T>>({
    id,
    quizType,
    mode: initialMode,
    difficultyLevel: 'easy',

    questionFilters: defualtQuizFilters,
  })
  const [isQuizValid, setIsQuizVaild] = useState<boolean>(true)

  const setMode = useCallback((mode: Mode_T) => {
    setData((prev) => ({ ...prev, mode }))
  }, [])

  const setDifficulty = useCallback((difficultyLevel: DifficultyLevel) => {
    setData((prev) => ({ ...prev, difficultyLevel }))
  }, [])

  const updateFilterCriteria = useCallback(
    <K extends keyof AppFilterCriteria>(key: K, value: AppFilterCriteria[K]) => {
      setData((prev) => ({
        ...prev,
        questionFilters: {
          ...(prev.questionFilters ?? defualtQuizFilters),
          [key]: value,
        },
      }))
    },
    []
  )

  const updateBibleRef = useCallback(
    <K extends BibleKey>(
      bibleKey: BibleKey,
      value: AppFilterCriteria['bookRange'][K]
    ) => {
      setData((prev) => ({
        ...prev,
        questionFilters: {
          ...(prev.questionFilters ?? defualtQuizFilters),
          bookRange: {
            ...prev.questionFilters?.bookRange,
            [bibleKey]: value,
          },
        },
      }))
    },
    []
  )

  const updateData = useCallback((newData: Partial<QuizSetupData<Mode_T>>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }, [])

  return useMemo(
    () => ({
      data,
      defualtQuizFilters,
      isQuizValid,
      minQuizQuestionLength,
      setIsQuizVaild,
      setMode,
      setDifficulty,
      updateData,
      updateBibleRef,
      updateFilterCriteria,
    }),
    [data, setDifficulty, setMode, updateBibleRef, updateData, updateFilterCriteria, isQuizValid, setIsQuizVaild]
  )
}

export function useQuizSetup<Mode_T> (): QuizSetupState<Mode_T> {
  const context = useContext(QuizSetupContext)
  if (!context) {
    throw new Error('useQuizSetup must be used within a <QuizSetup>')
  }
  return context as QuizSetupState<Mode_T>
}
