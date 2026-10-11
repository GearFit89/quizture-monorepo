import type { QuizMachineContext } from '@bq/shared/machines/quizzes/normal.machine';

/** Loaded question counts take precedence over the requested quiz length. */
export function getQuizDisplayState(context: QuizMachineContext, userId?: string) {
  const completed = context.completedQuestions.length;
  const remaining = context.incomingQuesions.length;
  const total = completed + remaining;
  const current = remaining > 0 ? completed + 1 : completed;
  // Solo quizzes may not populate the parent's activeUser yet.
  const scoreUsers = Object.keys(context.score);
  const scoreUser = userId ?? (context.activeUser || (scoreUsers.length === 1 ? scoreUsers[0] : ''));
  return {
    current,
    total,
    progress: total > 0 ? current / total : 0,
    points: context.score[scoreUser]?.points ?? 0,
    question: context.incomingQuesions[0],
  };
}

export function getQuizSummary(context: QuizMachineContext, userId?: string) {
  const display = getQuizDisplayState(context, userId);
  const questions = context.completedQuestions.filter((question) => userId === undefined || question.owner === userId);
  return {
    points: userId === undefined ? Object.values(context.score).reduce((sum, score) => sum + score.points, 0) : display.points,
    correct: questions.filter((question) => question.state === 'correct').length,
    incorrect: questions.filter((question) => question.state === 'incorrect').length,
    skipped: questions.filter((question) => question.state === 'skipped').length,
    completed: context.completedQuestions.length,
    total: display.total,
  };
}
