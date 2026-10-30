import { afterEach, describe, expect, it, vi } from 'vitest';
import { createActor, fromPromise, type ActorRefFrom } from 'xstate';
import type { normalQuestionMachine as questionMachine } from '../src/machines/questions/normal.machine';
import { rootMachine } from '../src/machines/root.machine';
import { normalQuizMachine as machine } from '../src/machines/quizzes/normal.machine';

const questions = [
  { id: 1, head: 'Header', body: 'Body', answer: 'Jesus' },
  { id: 2, head: 'Header 2', body: 'Body 2', answer: 'Moses' },
];
const actors: ReturnType<typeof createActor<typeof machine>>[] = [];
async function start(pool = questions, isQuestionTimed = false) {
  vi.useFakeTimers();
  const actor = createActor(machine.provide({ actors: { loadingQuizActor: fromPromise(async () => pool) } }), {
    input: { isQuestionTimed, quizLength: 20, userId: 'user', difficulty: 'hard' },
  });
  actors.push(actor);
  actor.start();
  actor.send({ type: 'LOAD' });
  await vi.advanceTimersByTimeAsync(160);
  return actor;
}
function child(actor: ReturnType<typeof createActor<typeof machine>>) {
  const question = actor.getSnapshot().children.questionNormalQuiz! as ActorRefFrom<typeof questionMachine>;
  question.send({ type: 'JUMP', username: 'user' });
  return question;
}
afterEach(() => { actors.splice(0).forEach((actor) => actor.stop()); vi.useRealTimers(); });

describe('normal quiz lifecycle', () => {
  it('grades the submitted text, replaces the child, records the last question and finishes', async () => {
    const actor = await start();
    const first = child(actor);
    expect(first.getSnapshot().context).toMatchObject({ question: { head: 'Header', body: 'Body', answer: 'Jesus' }, state: 'none' });
    first.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    expect(first.getSnapshot().matches('Correct')).toBe(true);
    expect(actor.getSnapshot().context.score.user.points).toBe(20);
    first.send({ type: 'NEXT' });
    const second = actor.getSnapshot().children.questionNormalQuiz! as ActorRefFrom<typeof questionMachine>;
    expect(second).not.toBe(first);
    expect(first.getSnapshot().status).toBe('done');
    await vi.advanceTimersByTimeAsync(160);
    second.send({ type: 'JUMP', username: 'user' });
    second.send({ type: 'USER_INPUT', userInput: 'Moses' });
    second.send({ type: 'NEXT' });
    expect(actor.getSnapshot().matches('Summary')).toBe(true);
    expect(actor.getSnapshot().context.incomingQuesions).toHaveLength(0);
    expect(actor.getSnapshot().context.completedQuestions).toHaveLength(2);
    expect(actor.getSnapshot().context.completedQuestions[0]).toMatchObject({ state: 'correct', owner: 'user', typedAnswers: ['Moses'] });
    expect(actor.getSnapshot().context.score.user.correct).toBe(2);
  });
  it('finishes an empty load without invoking a broken child', async () => {
    const actor = await start([]);
    expect(actor.getSnapshot().matches('Failed')).toBe(true);
    expect(actor.getSnapshot().children.questionNormalQuiz).toBeUndefined();
  });
  it('grades an empty answer as incorrect and records it once', async () => {
    const actor = await start([questions[0]]);
    const question = child(actor);
    question.send({ type: 'USER_INPUT', userInput: '' });
    expect(question.getSnapshot().matches('Incorrect')).toBe(true);
    question.send({ type: 'NEXT' });
    expect(actor.getSnapshot().context.score.user.incorrect).toBe(1);
    expect(actor.getSnapshot().context.completedQuestions[0].state).toBe('incorrect');
  });
  it('records retry attempts without duplicating the question', async () => {
    const actor = await start([questions[0]]);
    actor.send({ type: 'TRY_AGAIN', activeUser: 'user', typedAnswer: 'attempt' });
    expect(actor.getSnapshot().context.incomingQuesions).toHaveLength(1);
    expect(actor.getSnapshot().context.incomingQuesions[0].typedAnswers).toEqual(['attempt']);
  });
  it('uses the configured timer and permits next after timeout', async () => {
    const actor = await start([questions[0]], true);
    const question = child(actor);
    expect(question.getSnapshot().context.timerLength).toBe(30);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(question.getSnapshot().matches('Incorrect')).toBe(true);
    question.send({ type: 'NEXT' });
    expect(actor.getSnapshot().matches('Summary')).toBe(true);
  });
  it('advances unanswered questions after reveal and grace period', async () => {
    const actor = await start([questions[0]]);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(actor.getSnapshot().matches('Summary')).toBe(true);
    expect(actor.getSnapshot().context.completedQuestions[0].state).toBe('none');
  });
});

it('starts the real quiz from root with selected difficulty and preserves the result', async () => {
  vi.useFakeTimers();
  const root = createActor(rootMachine.provide({ actors: {
    NormalQuiz: machine.provide({ actors: { loadingQuizActor: fromPromise(async () => [questions[0]]) } }),
  } }));
  root.start();
  try {
    root.send({ type: 'NORMAL_QUIZ', isTimed: false, questions: [], quizLength: 1, difficulty: 'hard' });
    await vi.advanceTimersByTimeAsync(160);
    const quiz = root.getSnapshot().children['solo.normalQuiz']!;
    expect(quiz.getSnapshot().context.difficulty).toBe('hard');
    const question = quiz.getSnapshot().children.questionNormalQuiz! as ActorRefFrom<typeof questionMachine>;
    question.send({ type: 'JUMP', username: 'solo' });
    question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    question.send({ type: 'NEXT' });
    expect(quiz.getSnapshot().matches('Summary')).toBe(true);
    expect(root.getSnapshot().children['solo.normalQuiz']).toBe(quiz);
    quiz.send({ type: 'COMPLETE' });
    expect(quiz.getSnapshot().status).toBe('done');
    expect(root.getSnapshot().matches({ Activity: { Quizzing: 'Results' } })).toBe(true);
    expect(quiz.getSnapshot().context.completedQuestions).toHaveLength(1);
  } finally { root.stop(); }
});
