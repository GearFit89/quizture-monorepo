import { useSelector } from '@xstate/react';
import { useQuiz, useQuestionActor, useQuizContent } from '@/hooks';
import { Text } from '@/components/ui/text';
import { QuestionSection } from '../quiz/question-section';

export function NormalQuestion() {
  const actor = useQuiz();
  const question = useQuestionActor();
  const unavailable = useSelector(actor, (snapshot) => snapshot.matches('Active') || snapshot.matches('Failed') || snapshot.status === 'error');
  const content = useQuizContent();
  return question ? <QuestionSection key={question.sessionId} /> : <Text>{unavailable ? content.actorUnavailable : content.loading}</Text>;
}
