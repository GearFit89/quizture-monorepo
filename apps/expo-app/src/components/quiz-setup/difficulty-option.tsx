import React from 'react'
import { Pressable, View, StyleProp, ViewStyle } from 'react-native'
import { Text } from '@/components/ui/text'
import { DifficultyLevel } from '@bq/shared/types'
import { useQuizSetup } from '@/hooks/quiz-setup.hook'
import { useSetupContent, useStyleTarget } from '@/hooks'

export interface DifficultyOptionProps {
  value: DifficultyLevel;
  description?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const DifficultyOption: React.FC<DifficultyOptionProps> = ({
  value,
  description,
  onPress,
  style,
}) => {
  const { data, setDifficulty } = useQuizSetup()
  const { styles } = useStyleTarget('difficultyOption')

  const content = useSetupContent().difficultyOptions[value]
  const selected = data.difficultyLevel === value

  const handlePress = () => {
    setDifficulty(value)
    onPress?.()
  }

  return (
    <Pressable onPress={handlePress} accessibilityRole="radio" accessibilityState={{ selected }}>
      <View style={[styles.container, style, selected && styles.selected]}>
        <Text style={styles.title}>
          {content.title}
        </Text>
        <Text style={styles.desc}>{description ?? content.description}</Text>
      </View>
    </Pressable>
  )
}

export default DifficultyOption
