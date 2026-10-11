import React from 'react'
import { View, ScrollView } from 'react-native'
import { FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { PressableCard } from '@/components/pressable-card'
import { UI_QUIZZES, UIQuiz } from '@/lib/content/UI-quizzies.content'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { QuizMode } from '@bq/shared/types'
import { Icon as LucideIcon } from '@/components/ui/lucide-icon'
import {
  User,
  Users,
  ArrowUp,
  Settings,
  BookOpen,
  Layers,
} from 'lucide-react-native'
import { usePracticeContent } from '@/hooks'
import Icon from '@/components/icon'
function FlashCardButton () {
  const { flashCardButton } = usePracticeContent()

  return (
    <Button
      variant='default'
      className='h-auto flex-1 flex-col items-start gap-2 rounded-2xl border-border bg-card p-4'
    >
      <View className='w-full flex-row items-center gap-2'>
        <LucideIcon as={Layers} size={16} className='text-card-foreground' />
        <Text
          className='text-card-foreground text-base font-bold shrink'
          numberOfLines={1}
        >
          {flashCardButton.title}
        </Text>
      </View>
      {/* <Text
        variant="p"
        numberOfLines={2}
        className="text-muted-foreground w-full text-sm"
      >
        {flashCardButton.description}
      </Text> */}
    </Button>
  )
}

function ContentButton () {
  const { contentButton } = usePracticeContent()

  return (
    <Button
      variant='default'
      className='h-auto flex-1 flex-row items-start gap-2 rounded-2xl border-border bg-card p-4'
    >
      <View className='flex-1 flex-row items-center gap-2'>
        <LucideIcon as={BookOpen} size={16} className='text-card-foreground' />
        <Text className='text-card-foreground text-base font-bold'>
          {contentButton.title}
        </Text>
      </View>

    </Button>
  )
}

function QuizGrid () {
  const [mode, setMode] = React.useState<QuizMode>('SOLO')
  const router = useRouter()

  const activeQuizzes: UIQuiz[] =
    mode === 'SOLO' ? UI_QUIZZES.SOLO : UI_QUIZZES.VS

  return (
    <View className='mt-2 flex-1 gap-3'>
      {/* Tab Switcher */}
      <View className='mb-4 flex-row gap-2'>
        <Button
          variant={mode === 'SOLO' ? 'default' : 'outline'}
          onPress={() => setMode('SOLO')}
          className='h-9 flex-row items-center gap-2 border-0 bg-card px-3 py-1.5'
        >
          <LucideIcon as={User} size={16} className='text-card-foreground' />
          <Text className='text-card-foreground text-sm'>Solo</Text>
        </Button>

        <Button
          variant={mode === 'VS' ? 'default' : 'outline'}
          onPress={() => setMode('VS')}
          className='h-9 flex-row items-center gap-2 border-0 bg-card px-3 py-1.5'
        >
          <LucideIcon as={Users} size={16} className='text-card-foreground' />
          <Text className='text-card-foreground text-sm'>VS</Text>
        </Button>
      </View>

      {/* Quiz List as 2-column grid */}
      <FlatList
        data={activeQuizzes}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(quiz) => quiz.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}

        renderItem={({ item: quiz }) => (
          <PressableCard data={quiz} onPress={() => router.push(`/setup/${quiz.id}`)} />
        )}
      />
    </View>
  )
}

function BottomActions ({ onScrollToTop }: { onScrollToTop: () => void }) {
  const router = useRouter()

  return (
    <View className='mt-6 flex-row gap-2'>
      <Button
        variant='outline'
        onPress={onScrollToTop}
        className='h-10 flex-1 flex-row items-center justify-center gap-2 border-border'
      >
        <LucideIcon as={ArrowUp} size={16} className='text-card-foreground' />
        <Text className='text-card-foreground text-sm'>Top</Text>
      </Button>

      <Button
        variant='outline'
        onPress={() => router.push('/settings')}
        className='h-10 flex-1 flex-row items-center justify-center gap-2 border-border'
      >
        <LucideIcon
          as={Settings}
          size={16}
          className='text-card-foreground'
        />
        <Text className='text-card-foreground text-sm'>Settings</Text>
      </Button>

      <Button
        variant='outline'
        onPress={() => router.push('/materials')}
        className='h-10 flex-1 flex-row items-center justify-center gap-2 border-border'
      >
        <LucideIcon as={Layers} size={16} className='text-card-foreground' />
        <Text className='text-card-foreground text-sm'>Materials</Text>
      </Button>
    </View>
  )
}

export default function PracticePage () {
  const scrollRef = React.useRef<ScrollView>(null)

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true })
  }

  return (
    <ScrollView
      ref={scrollRef}
      className='flex-1'
      contentContainerClassName='gap-y-4 p-4'
      showsVerticalScrollIndicator={false}
    >
      <View className='flex-row gap-3'>
        <ContentButton />
        <FlashCardButton />
      </View>

      <QuizGrid />

      <BottomActions onScrollToTop={scrollToTop} />
    </ScrollView>
  )
}
