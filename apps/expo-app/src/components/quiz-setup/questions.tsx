import { useQuizSetup, useSetupContent, useStyleTarget } from '@/hooks'
import { useFilteredQuestions, useQuestions } from '@/hooks/use-questions'
import { useEffect, useMemo } from 'react'
import { Modal, View } from 'react-native'
import { Text } from '@/components/ui/text'
import Icon from '@/components/icon'
import { TriangleAlertIcon } from 'lucide-react-native'

export function FilteredQuestions () {
  const { data, isQuizValid, setIsQuizVaild, minQuizQuestionLength } =
    useQuizSetup()

  if (!data.questionFilters) return null

  const { questions, isLoadingError, error } = useFilteredQuestions({
    filterCriteria: data.questionFilters,
  })

  error && console.error(error)

  useEffect(() => {
    setIsQuizVaild(questions.length >= minQuizQuestionLength)
  }, [questions])

  return (
    <View>
      <QuizSetupLength length={questions.length} quizLength={minQuizQuestionLength} />
      {!isQuizValid && <QuizSetupError />}
    </View>
  )
}

function QuizSetupError () {
  const { errorInvalidQuestionLength } = useSetupContent()

  return (
    <View className='border-border'>
      <TriangleAlertIcon color='red' size={20} />
      <Text className='text-red-500' numberOfLines={1}>{errorInvalidQuestionLength.title}</Text>
      <Text className='text-red-500'>{errorInvalidQuestionLength.message}</Text>
    </View>
  )
}

function QuizSetupLength ({ length, quizLength }: { length: number; quizLength: number }) {
  const { styles } = useStyleTarget('quizSetup')
  const content = useSetupContent()
  return (
    <View style={styles.quizLength}>
      <Icon name="help" size={24} color="#2563eb" />
      <View style={styles.countText}>
        <Text style={styles.countTitle}>{content.questionCount.replace('{count}', String(length))}</Text>
        <Text style={styles.countHint}>{content.questionCountHint.replace('{count}', String(quizLength))}</Text>
      </View>
    </View>
  )
}
