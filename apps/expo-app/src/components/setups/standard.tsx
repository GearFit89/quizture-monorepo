import { QuizSetupProvider, SetupDifficultyOption, SetupModeOption } from '@/components/quiz-setup'
import { QuizMode } from '@bq/shared/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import DefaultQuizFilters from '../question-filters/default-quiz-filters'
import { useSetupContent } from '@/hooks/'
import { useActorRef } from '@xstate/react'
import { rootMachine } from '@bq/shared/machines'
import { Button } from '@/components/ui/button'
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated'
import { useQuestions } from '@/hooks/use-questions'
import { multiQuestionFilter } from '@bq/shared/services/filter.service'
import { useMemo } from 'react'
import { FilteredQuestions } from '../quiz-setup/questions'
import QuizStartButton from '../quiz-setup/quiz-start-button'

export default function StandardSetup () {
  const actorRef = useActorRef(rootMachine)
  const router = useRouter()
  const { id, type } = useLocalSearchParams<{ id: string, type: QuizMode }>()
  const { standard: content } = useSetupContent()

  return (
    <QuizSetupProvider
      id={id}
      quizType={type}
      initialMode='normal'
      minQuizQuestionLength={20}
    >

      <SetupModeOption
        value='normal'
        {...content.modes.normal}
      />
      <SetupModeOption
        value='timed'
        {...content.modes.timed}
      />

      <SetupDifficultyOption value='easy' />
      <SetupDifficultyOption value='medium' />
      <SetupDifficultyOption value='hard' />

      <DefaultQuizFilters />
      <FilteredQuestions />
      <QuizStartButton />
    </QuizSetupProvider>
  )
}
