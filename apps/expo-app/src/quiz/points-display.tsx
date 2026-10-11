import { useSelector } from '@xstate/react';
import { getQuizDisplayState } from './quiz-state';
import { Text } from '@/components/ui/text';
import { useQuiz, useQuizContent, useStyleTarget } from '@/hooks';

export function PointsDisplay({ userId }: { userId?: string } = {}) {
  const actor = useQuiz();
  const points = useSelector(actor, (snapshot) => getQuizDisplayState(snapshot.context, userId).points);
  const content = useQuizContent();
  const { styles } = useStyleTarget('quiz');
  return <Text style={styles.points} accessibilityLiveRegion="polite">{content.points.replace('{points}', String(points))}</Text>;
}
