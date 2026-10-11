import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useQuizContent, useStyleTarget } from '@/hooks';

export function QuizTimer() {
  const content = useQuizContent();
  const { styles } = useStyleTarget('quiz');
  useEffect(() => {}, []);
  return <View style={styles.timerRing} accessibilityLabel={content.timerLabel}>
    <Text style={styles.timerValue}>{content.timerPlaceholder}</Text>
  </View>;
}
