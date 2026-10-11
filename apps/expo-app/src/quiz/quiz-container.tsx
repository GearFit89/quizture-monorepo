import type { ReactNode } from 'react';
import { ScrollView, View, type ColorValue } from 'react-native';
import { useSelector } from '@xstate/react';
import { useQuiz, useStyleTarget } from '@/hooks';
import { ProgressBar } from './progress-bar';
import { PointsDisplay } from './points-display';
import { NormalQuiz } from './normal-quiz';
import { QuizSummary } from './quiz-summary';



export interface QuizContainerProps {
  color?: ColorValue;
  userId?: string;
  children?: ReactNode;
  controls?: ReactNode;
}

/** Answer controls remain responsible for sending events to the question actor. */
export function QuizContainer({
  color,
  userId,
  children,
  controls,
}: QuizContainerProps) {
  const actor = useQuiz();
  const isSummary = useSelector(actor, (snapshot) => snapshot.matches('Summary'));
  const { styles } = useStyleTarget('quiz');


  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <ProgressBar color={color} />
        <PointsDisplay userId={userId} />
      </View>
      <View style={styles.question}>
        {isSummary ? (
          <QuizSummary userId={userId} />
        ) : (
          children ?? <NormalQuiz />
        )}
      </View>
      <View style={styles.controls}>{!isSummary && controls}</View>
    </ScrollView>
  );
}
