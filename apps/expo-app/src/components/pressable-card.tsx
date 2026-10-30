import React from 'react'
import { View, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import Icon from './icon'
import { UIQuiz } from '@/lib/content/UI-quizzies.content'
import { cn } from '@/lib/utils' // swap for your actual classnames util if named differently

interface QuizCardProps {
  /**
   * The data that displays the quiz
   */
  data: UIQuiz;

  /**
   * The callback when the card is pressed
   * @param data
   * @returns void
   */
  onPress?: (data: UIQuiz) => void;

  /**
   * Optional className override for the outer Pressable — lets a parent
   * grid control width/flex without fighting a hardcoded size.
   */
  className?: string;

  /**
   * Optional accessibility role and custom label
   */
  aRole?: 'button' | 'link' | 'none' | 'header' | 'search' | 'image' | 'adjustable' | 'checkbox' | 'summary';
  aLabel?: string;
}

/**
 * @param props - The component props defined by {@link QuizCardProps}.
 * @returns - A quiz card that users select
 */
export default function PressableCard ({
  data,
  onPress,
  className,
  aRole = 'button',
  aLabel,
}: QuizCardProps) {
  return (
    <Pressable
      className={cn(
        'w-[50%] aspect-square bg-card rounded-2xl p-5 shadow-sm border border-border items-center justify-center active:opacity-80',
        className
      )}
      onPress={() => onPress && onPress(data)}
      accessibilityRole={aRole}
      accessibilityLabel={aLabel ?? `Select Quiz: ${data.title}`}
    >
      {/* Icon Section — big and proud */}
      <View className='items-center justify-center'>
        <View className='w-20 h-20 bg-purple-100 rounded-2xl items-center justify-center'>
          <Icon name={data.icon} size={40} color='#7c3aed' />
        </View>
      </View>

      {/* Text Content */}
      <View className='items-center w-full px-1 mt-3 gap-1'>
        <Text
          className='font-bold text-card-foreground text-base text-center'
          numberOfLines={1}
        >
          {data.title}
        </Text>
        <Text
          className='text-xs text-muted-foreground text-center'
          numberOfLines={2}
        >
          {data.shortDescription}
        </Text>
      </View>
    </Pressable>
  )
}

export { PressableCard }
