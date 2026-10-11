import { QuizSetupStateArgs, useQuizSetup, useQuizSetupState } from '@/hooks/quiz-setup.hook'
import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import { QuizMode } from '@bq/shared/types'
import { useActor, useActorRef } from '@xstate/react'
import { DifficultyLevel } from '@bq/shared/types'
import { QuizSetupContext } from '@/context'
import { useSetupContent } from '@/hooks/content.hook'

interface QuizSetupProviderProps< Mode_T > extends QuizSetupStateArgs <Mode_T> {
  children: React.ReactNode;

}

export function QuizSetupProvider<Mode_T> ({
  children,
  quizType,
  id,
  minQuizQuestionLength,
  initialMode
}: QuizSetupProviderProps<Mode_T>
) {
  const quizSetupState = useQuizSetupState({
    quizType,
    initialMode,
    id,
    minQuizQuestionLength

  })

  return (
    <QuizSetupContext.Provider value={quizSetupState}>

      {children}

    </QuizSetupContext.Provider>
  )
}
