import { afterEach, describe, expect, it } from 'vitest';
import { createActor, fromPromise, waitFor } from 'xstate';
import { normalQuizMachine as machine } from '../src/machines/quizzes/normal.machine';
import { rootMachine } from '../src/machines/root.machine';

const questions = [{ id: 1, head: 'Header', body: 'Body', answer: 'Jesus' }];
const quiz = machine.provide({ actors: { loadingQuizActor: fromPromise(async () => questions) } });
const actors: { stop: () => void }[] = [];
afterEach(() => actors.splice(0).forEach((actor) => actor.stop()));

it('records the final question and retains context in Summary until COMPLETE', async () => {
  const actor = createActor(quiz, { input: { isQuestionTimed: false, quizLength: 1, questions: [] } });
  actors.push(actor); actor.start();
  await waitFor(actor, (snapshot) => snapshot.matches('Active'));
  actor.send({ type: 'COMPLETE' });
  expect(actor.getSnapshot().matches('Active')).toBe(true);
  actor.send({ type: 'CORRECT', activeUser: 'solo' });
  actor.send({ type: 'NEXT', state: 'correct', owner: 'solo', typedAnswer: 'Jesus' });
  const summary = actor.getSnapshot();
  expect(summary.matches('Summary')).toBe(true);
  expect(summary.status).toBe('active');
  expect(summary.children.questionNormalQuiz).toBeUndefined();
  expect(summary.context.completedQuestions[0]).toMatchObject({ state: 'correct', typedAnswers: ['Jesus'] });
  expect(summary.context.score.solo.points).toBe(20);
  actor.send({ type: 'COMPLETE' });
  expect(actor.getSnapshot().matches('Finished')).toBe(true);
  expect(actor.getSnapshot().status).toBe('done');
});

it('keeps the root quiz child during Summary and removes it after COMPLETE', async () => {
  const root = createActor(rootMachine.provide({ actors: { NormalQuiz: quiz } }));
  actors.push(root); root.start();
  root.send({ type: 'NORMAL_QUIZ', isTimed: false, questions: [], quizLength: 1 });
  const child = root.getSnapshot().children['solo.normalQuiz']!;
  await waitFor(child, (snapshot) => snapshot.matches('Active'));
  child.send({ type: 'NEXT', state: 'correct', owner: 'solo', typedAnswer: 'Jesus' });
  expect(child.getSnapshot().matches('Summary')).toBe(true);
  expect(root.getSnapshot().children['solo.normalQuiz']).toBe(child);
  child.send({ type: 'COMPLETE' });
  expect(root.getSnapshot().matches({ Activity: { Quizzing: 'Results' } })).toBe(true);
  expect(root.getSnapshot().children['solo.normalQuiz']).toBeUndefined();
});

it('discards a quiz in Summary when the root receives ACTIVITY_QUIT', async () => {
  const root = createActor(rootMachine.provide({ actors: { NormalQuiz: quiz } }));
  actors.push(root); root.start();
  root.send({ type: 'NORMAL_QUIZ', isTimed: false, questions: [], quizLength: 1 });
  const child = root.getSnapshot().children['solo.normalQuiz']!;
  await waitFor(child, (snapshot) => snapshot.matches('Active'));
  child.send({ type: 'NEXT', state: 'skipped', owner: 'solo', typedAnswer: '' });
  root.send({ type: 'ACTIVITY_QUIT' });
  expect(root.getSnapshot().matches({ Activity: 'Idle' })).toBe(true);
  expect(child.getSnapshot().status).toBe('stopped');
  expect(root.getSnapshot().children['solo.normalQuiz']).toBeUndefined();
});

it('uses Failed for an empty load rather than showing Summary', async () => {
  const actor = createActor(machine.provide({ actors: { loadingQuizActor: fromPromise(async (): Promise<typeof questions> => []) } }), { input: { isQuestionTimed: false, quizLength: 1 } });
  actors.push(actor); actor.start();
  await waitFor(actor, (snapshot) => snapshot.status === 'done');
  expect(actor.getSnapshot().matches('Failed')).toBe(true);
});
