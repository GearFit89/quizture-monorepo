import { useSelector } from '@xstate/react';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { View } from 'react-native';
import type { QuizMachineContext } from '@bq/shared/machines/quizzes/normal.machine';
import { useQuiz, useQuizContent, useStyleTarget } from '@/hooks';
import { Text } from '@/components/ui/text';
import { getQuizSummary } from './quiz-state';

export function QuizSummary({ userId }: { userId?: string }) {
  const actor = useQuiz();
  const context = useSelector(actor, (snapshot) => snapshot.context as QuizMachineContext);
  const router = useRouter();
  const complete = () => {
    actor.send({ type: 'COMPLETE' });
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  const content = useQuizContent();
  const { styles } = useStyleTarget('quiz');
  const summary = getQuizSummary(context, userId);
  return <View style={styles.summary}>
    <Text style={styles.summaryTitle}>{content.finished}</Text>
    <Text>{content.summaryScore.replace('{points}', String(summary.points))}</Text>
    <Text>{content.summaryCorrect.replace('{correct}', String(summary.correct))}</Text>
    <Text>{content.summaryIncorrect.replace('{incorrect}', String(summary.incorrect))}</Text>
    <Text>{content.summarySkipped.replace('{skipped}', String(summary.skipped))}</Text>
    <Text>{content.summaryCompleted.replace('{completed}', String(summary.completed)).replace('{total}', String(summary.total))}</Text>
    <Button onPress={complete}><Text>{content.complete}</Text></Button>
  </View>;
}
