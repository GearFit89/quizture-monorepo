import { describe, expect, it } from 'vitest';
import type { QuizMachineContext } from '@bq/shared/machines/quizzes/normal.machine';
import { createAnswerBlocks } from '../answer-blocks';
import { getQuizDisplayState, getQuizSummary } from '../quiz-state';

const question = { head: 'Question', body: 'Body', answer: 'Answer' };
function context(overrides: Partial<QuizMachineContext> = {}): QuizMachineContext {
  return { incomingQuesions: [], completedQuestions: [], quizLength: 20,
    activeUser: 'user', score: {}, ...overrides } as QuizMachineContext;
}

describe('quiz display state', () => {
  it('handles a quiz before questions load', () => {
    expect(getQuizDisplayState(context())).toMatchObject({ current: 0, total: 0, progress: 0, points: 0, question: undefined });
  });
  it('uses actual loaded length and selects the current question', () => {
    const result = getQuizDisplayState(context({ incomingQuesions: [question, question] as never, completedQuestions: [question] as never }));
    expect(result).toMatchObject({ current: 2, total: 3, progress: 2 / 3, question });
  });
  it('keeps progress at the total when all questions are completed', () => {
    expect(getQuizDisplayState(context({ completedQuestions: [question, question] as never }))).toMatchObject({ current: 2, total: 2, progress: 1 });
  });
  it('reads active user score and allows explicit user selection', () => {
    const state = context({ score: { user: { points: -5 }, other: { points: 25 } } as never });
    expect(getQuizDisplayState(state).points).toBe(-5);
    expect(getQuizDisplayState(state, 'other').points).toBe(25);
    expect(getQuizDisplayState(state, 'missing').points).toBe(0);
  });
  it('uses a sole solo score when the parent has no active user, without summing multiplayer scores', () => {
    const state = context({ activeUser: '', score: { user: { points: 10 } } as never });
    expect(getQuizDisplayState(state).points).toBe(10);
    expect(getQuizDisplayState({ ...state, score: { ...state.score, other: { points: 20 } } as never }).points).toBe(0);
  });
});

describe('answer blocks and completion summary', () => {
  it('preserves repeated words with distinct selectable IDs', () => {
    const blocks = createAnswerBlocks('  in the   beginning in ', () => 0);
    expect(blocks.map((block) => block.id).sort()).toEqual(['0', '1', '2', '3']);
    expect(blocks.filter((block) => block.data === 'in')).toHaveLength(2);
    expect(createAnswerBlocks('  ')).toEqual([]);
  });
  it('summarizes recorded outcomes, including skips and negative scores', () => {
    const state = context({ completedQuestions: [
      { ...question, state: 'correct', owner: 'user' },
      { ...question, state: 'incorrect', owner: 'other' },
      { ...question, state: 'skipped' },
    ] as never, score: { user: { points: 20 }, other: { points: -10 } } as never });
    expect(getQuizSummary(state)).toEqual({ points: 10, correct: 1, incorrect: 1, skipped: 1, completed: 3, total: 3 });
    expect(getQuizSummary(state, 'user')).toMatchObject({ points: 20, correct: 1, incorrect: 0, skipped: 0 });
  });
});
