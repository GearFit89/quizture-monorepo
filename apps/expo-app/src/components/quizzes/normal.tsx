import { useSelector } from '@xstate/react';
import { useQuiz } from '@/hooks';
import { QuizSummary } from '../quiz';
import { NormalQuestion } from '../questions/normal';
import { QuizContainer, type QuizContainerProps } from './quiz-container';

export function NormalQuiz({ color, userId, controls }: Omit<QuizContainerProps, 'children'> = {}) {
  const actor = useQuiz();
  const isSummary = useSelector(actor, (snapshot) => snapshot.matches('Summary'));
  return (
    <QuizContainer color={color} userId={userId} controls={!isSummary && controls}>
      {isSummary ? <QuizSummary userId={userId} /> : <NormalQuestion />}
    </QuizContainer>
  );
}
