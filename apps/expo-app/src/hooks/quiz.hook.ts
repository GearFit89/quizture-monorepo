import { useSelector } from '@xstate/react';
import type { QuestionActorRef } from '@bq/shared/types/machine';
import { useContext } from 'react';
import { QuizActorContext } from '@/context';

export function useQuiz() {
  const context = useContext(QuizActorContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}


export function useQuestionActor() {
  const quizActor = useQuiz();
  return useSelector(quizActor, (snapshot) => snapshot.children.questionNormalQuiz as QuestionActorRef | undefined);
}
