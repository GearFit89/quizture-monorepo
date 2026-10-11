import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor, fromPromise, type ActorRefFrom } from 'xstate';
import { normalQuizMachine as machine, type QuizLoadInput } from '../src/machines/quizzes/normal.machine';
import type { normalQuestionMachine as questionMachine } from '../src/machines/questions/normal.machine';
import { defaultScoreConfig } from '../src/score-config/default-score-config';
import type { QuizQuestion } from '../src/types/question';

const pool: QuizQuestion[] = [{ id: 1, head: 'Header', body: 'Body', answer: 'Jesus' }];
const actors: ActorRefFrom<typeof machine>[] = [];
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { actors.splice(0).forEach((actor) => actor.stop()); vi.useRealTimers(); });
function track(actor: ActorRefFrom<typeof machine>) {
  actors.push(actor);
  actor.start();
  return actor;
}
function quiz(questions = pool, input: Parameters<typeof createActor<typeof machine>>[1]['input'] = { isQuestionTimed: false, quizLength: 20 }) {
  return track(createActor(machine.provide({ actors: {
    loadingQuizActor: fromPromise(async () => questions),
  } }), { input }));
}
async function load(actor: ActorRefFrom<typeof machine>) {
  actor.send({ type: 'LOAD' });
  await vi.advanceTimersByTimeAsync(150);
  return actor.getSnapshot().children.questionNormalQuiz! as ActorRefFrom<typeof questionMachine>;
}

describe('normal quiz machine loading and scoring', () => {
  it('automatically loads initial questions with empty queues', async () => {
    const seen = vi.fn();
    const filtered = [{ id: 1, type: 'question' as const, question: 'Who?', answer: 'Jesus', book: 'John', chapter: '1', verse: '1' }];
    const actor = track(createActor(machine.provide({ actors: {
      loadingQuizActor: fromPromise<QuizQuestion[], QuizLoadInput>(async ({ input }) => { seen(input); return []; }),
    } }), { input: { isQuestionTimed: false, quizLength: 7, questions: filtered } }));
    expect(actor.getSnapshot().matches('Loading')).toBe(true);
    expect(actor.getSnapshot().context).toMatchObject({ score: {}, incomingQuesions: [], completedQuestions: [], activeUser: 'solo', difficulty: 'easy' });
    await vi.advanceTimersByTimeAsync(0);
    expect(seen).toHaveBeenCalledExactlyOnceWith({ questions: filtered, quizLength: 7 });
    expect(actor.getSnapshot().status).toBe('done');
  });

  it('stays loading without a question child until the asynchronous loader resolves', async () => {
    let resolve!: (value: QuizQuestion[]) => void;
    const pending = new Promise<QuizQuestion[]>((done) => { resolve = done; });
    const actor = track(createActor(machine.provide({ actors: {
      loadingQuizActor: fromPromise(() => pending),
    } }), { input: { isQuestionTimed: false, quizLength: 1 } }));
    actor.send({ type: 'LOAD' });
    expect(actor.getSnapshot().matches('Loading')).toBe(true);
    expect(actor.getSnapshot().children.questionNormalQuiz).toBeUndefined();
    actor.send({ type: 'LOAD' });
    resolve(pool);
    await vi.advanceTimersByTimeAsync(0);
    expect(actor.getSnapshot().matches({ Active: 'Questioning' })).toBe(true);
    expect(actor.getSnapshot().context.incomingQuesions).toEqual(pool);
  });

  it('moves to failed on loader rejection without invoking a question', async () => {
    const actor = track(createActor(machine.provide({ actors: {
      loadingQuizActor: fromPromise<QuizQuestion[], QuizLoadInput>(async () => { throw new Error('Load failed'); }),
    } }), { input: { isQuestionTimed: false, quizLength: 1 } }));
    actor.send({ type: 'LOAD' });
    await vi.advanceTimersByTimeAsync(0);
    expect(actor.getSnapshot().matches('Failed')).toBe(true);
    expect(actor.getSnapshot().status).toBe('done');
    expect(actor.getSnapshot().children.questionNormalQuiz).toBeUndefined();
    expect(actor.getSnapshot().context.completedQuestions).toEqual([]);
  });

  it('automatically loads supplied initial questions and initializes the child', async () => {
    const actor = quiz(pool, { isQuestionTimed: false, quizLength: 1, questions: [], userId: 'user', difficulty: 'hard' });
    await vi.advanceTimersByTimeAsync(0);
    expect(actor.getSnapshot().context).toMatchObject({ activeUser: 'user', difficulty: 'hard' });
    expect((actor.getSnapshot().children.questionNormalQuiz! as ActorRefFrom<typeof questionMachine>).getSnapshot().context).toMatchObject({
      question: { head: 'Header', body: 'Body', answer: 'Jesus' }, userInput: '', activeUser: 'user',
      timerLength: Infinity, isQuestionTimed: false,
      incommingCharsArr: Array.from('Body'), displayedCharsArr: [], state: 'none',
    });
  });

  it('applies custom scores to the jumping user without replacing the current child', async () => {
    const actor = quiz(pool, { isQuestionTimed: false, quizLength: 1, userId: 'initial', scoreConfig: {
      ...defaultScoreConfig, quizOuts: [], question: {
        correct: { ...defaultScoreConfig.question.correct, points: 7 },
        incorrect: { ...defaultScoreConfig.question.incorrect, points: -2 },
      },
    } });
    const question = await load(actor);
    question.send({ type: 'JUMP', username: 'other' });
    question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    expect(actor.getSnapshot().children.questionNormalQuiz).toBe(question);
    expect(actor.getSnapshot().context.score.other).toMatchObject({ points: 7, correct: 1, incorrect: 0 });
    expect(actor.getSnapshot().context.score.initial).toBeUndefined();
    question.send({ type: 'NEXT' });
    expect(actor.getSnapshot().context.completedQuestions[0].owner).toBe('other');
  });

  it('adds the configured quiz-out bonus at five correct answers', async () => {
    const actor = quiz(Array.from({ length: 5 }, (_, id) => ({ ...pool[0], id })));
    await load(actor);
    for (let index = 0; index < 5; index++) {
      const question = actor.getSnapshot().children.questionNormalQuiz! as ActorRefFrom<typeof questionMachine>;
      question.send({ type: 'JUMP', username: 'solo' });
      question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
      question.send({ type: 'NEXT' });
      await vi.advanceTimersByTimeAsync(150);
    }
    expect(actor.getSnapshot().matches('Summary')).toBe(true);
    expect(actor.getSnapshot().context.score.solo).toMatchObject({ points: 110, correct: 5, incorrect: 0, state: 'out' });
    expect(actor.getSnapshot().context.completedQuestions).toHaveLength(5);
  });

  it('records successive retries without replacing or duplicating the current question', async () => {
    const actor = quiz();
    const question = await load(actor);
    actor.send({ type: 'TRY_AGAIN', activeUser: 'solo', typedAnswer: 'first' });
    actor.send({ type: 'TRY_AGAIN', activeUser: 'solo', typedAnswer: 'second' });
    expect(actor.getSnapshot().children.questionNormalQuiz).toBe(question);
    expect(actor.getSnapshot().context.incomingQuesions).toHaveLength(1);
    expect(actor.getSnapshot().context.incomingQuesions[0].typedAnswers).toEqual(['first', 'second']);
    expect(actor.getSnapshot().context.score).toEqual({});
    question.send({ type: 'JUMP', username: 'solo' });
    question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    question.send({ type: 'NEXT' });
    expect(actor.getSnapshot().context.completedQuestions[0].typedAnswers).toEqual(['first', 'second', 'Jesus']);
  });

  it('stops its question child and cancels pending timeouts when stopped', async () => {
    const actor = quiz();
    const question = await load(actor);
    actor.stop();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(question.getSnapshot().status).toBe('stopped');
    expect(actor.getSnapshot().context.completedQuestions).toEqual([]);
    expect(actor.getSnapshot().context.score).toEqual({});
  });
});
