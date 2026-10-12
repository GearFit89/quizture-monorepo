import type { ReactNode } from 'react';
import { ScrollView, View, type ColorValue } from 'react-native';
import { useStyleTarget } from '@/hooks';
import { ProgressBar, PointsDisplay } from '../quiz';

export interface QuizContainerProps {
  color?: ColorValue;
  userId?: string;
  children: ReactNode;
  controls?: ReactNode;
}

export function QuizContainer({ color, userId, children, controls }: QuizContainerProps) {
  const { styles } = useStyleTarget('quiz');
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <ProgressBar color={color} />
        <PointsDisplay userId={userId} />
      </View>
      <View style={styles.question}>{children}</View>
      <View style={styles.controls}>{controls}</View>
    </ScrollView>
  );
}
