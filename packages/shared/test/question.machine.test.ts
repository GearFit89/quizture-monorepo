import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { assign, createActor, enqueueActions, setup } from 'xstate';
import { normalQuestionMachine as questionMachine, type QuestionMachineContext } from '../src/machines/questions/normal.machine';
import type { QuizEvent } from '../src/machines/quizzes/normal.machine';

function input(overrides: Partial<QuestionMachineContext> = {}): QuestionMachineContext {
  return {
    question: { head: 'Header', body: 'ABC', answer: 'Jesus' }, userInput: '', timerLength: 2, isQuestionTimed: true,
    activeUser: 'solo', type: 'normal', state: 'skipped',
    incommingCharsArr: ['A', 'B', 'C'], displayedCharsArr: [], ...overrides,
  };
}

function host(overrides: Partial<QuestionMachineContext> = {}, retry = false) {
  const childMachine = retry ? questionMachine.provide({ actions: {
    // Control grading only to exercise TRY_AGAIN independently of fuzzy matching rules.
    checkInput: enqueueActions(({ context, enqueue }) => {
      enqueue.raise({ type: context.userInput === 'Jesus' ? 'CORRECT' : 'TRY_AGAIN' });
    }),
  } }) : questionMachine;
  const parentMachine = setup({
    types: { context: {} as { events: QuizEvent[] }, events: {} as QuizEvent },
    actors: { question: childMachine },
    actions: { record: assign({ events: ({ context, event }) => [...context.events, event] }) },
  }).createMachine({
    context: { events: [] },
    invoke: { id: 'question', src: 'question', input: input(overrides) },
    on: { CORRECT: { actions: 'record' }, INCORRECT: { actions: 'record' },
      TRY_AGAIN: { actions: 'record' }, NEXT: { actions: 'record' } },
  });
  const parent = createActor(parentMachine);
  parents.push(parent);
  parent.start();
  return { parent, question: parent.getSnapshot().children.question! };
}
const parents: { stop: () => void }[] = [];
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { parents.splice(0).forEach((parent) => parent.stop()); vi.useRealTimers(); });

function jump(question: ReturnType<typeof host>['question']) {
  vi.advanceTimersByTime(150);
  question.send({ type: 'JUMP', username: 'user' });
}

describe('normal question machine', () => {
  it('displays header, prefix, and characters in order with a grace period before skipping', () => {
    const { parent, question } = host();
    expect(question.getSnapshot().context.headDisplay).toBe('Header');
    vi.advanceTimersByTime(49);
    expect(question.getSnapshot().context.startQuestionDisplay).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(question.getSnapshot().context.startQuestionDisplay).toBe('Question: ');
    vi.advanceTimersByTime(100);
    expect(question.getSnapshot().context.displayedCharsArr).toEqual(['A']);
    vi.advanceTimersByTime(600);
    expect(question.getSnapshot().context.displayedCharsArr).toEqual(['A', 'B', 'C']);
    for (let tick = 0; tick < 3 && !question.getSnapshot().matches({ WaitingForJump: 'CharsDone' }); tick++) {
      vi.advanceTimersToNextTimer();
    }
    expect(question.getSnapshot().matches({ WaitingForJump: 'CharsDone' })).toBe(true);
    vi.advanceTimersByTime(4999);
    expect(parent.getSnapshot().context.events).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(question.getSnapshot().status).toBe('done');
    expect(parent.getSnapshot().context.events).toEqual([{ type: 'NEXT', state: 'skipped', owner: 'solo', typedAnswer: '' }]);
  });

  it('respects a supplied prefix and handles an empty body without undefined characters', () => {
    const { question } = host({ startQuestion: 'Prompt: ', incommingCharsArr: [] });
    vi.advanceTimersByTime(450);
    expect(question.getSnapshot().context.startQuestionDisplay).toBe('Prompt: ');
    expect(question.getSnapshot().context.displayedCharsArr).toEqual([]);
    expect(question.getSnapshot().matches({ WaitingForJump: 'CharsDone' })).toBe(true);
  });

  it('ignores input and NEXT before jumping, then records the jumping user', () => {
    const { parent, question } = host();
    question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    question.send({ type: 'NEXT' });
    expect(parent.getSnapshot().context.events).toEqual([]);
    jump(question);
    expect(question.getSnapshot().matches({ WaitingForInput: 'Waiting' })).toBe(true);
    expect(question.getSnapshot().context.activeUser).toBe('user');
    question.send({ type: 'NEXT' });
    expect(question.getSnapshot().status).toBe('active');
  });

  it('emits CORRECT once and sends the outcome and submitted text on NEXT', () => {
    const { parent, question } = host();
    jump(question);
    question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    expect(question.getSnapshot().matches('Correct')).toBe(true);
    expect(parent.getSnapshot().context.events).toEqual([{ type: 'CORRECT', activeUser: 'user' }]);
    question.send({ type: 'USER_INPUT', userInput: 'changed' });
    question.send({ type: 'NEXT' });
    question.send({ type: 'NEXT' });
    expect(parent.getSnapshot().context.events).toEqual([
      { type: 'CORRECT', activeUser: 'user' },
      { type: 'NEXT', state: 'correct', owner: 'user', typedAnswer: 'Jesus' },
    ]);
    expect(question.getSnapshot().status).toBe('done');
  });

  it('emits INCORRECT for an empty answer and waits for NEXT', () => {
    const { parent, question } = host();
    jump(question);
    question.send({ type: 'USER_INPUT', userInput: '' });
    expect(question.getSnapshot().matches('Incorrect')).toBe(true);
    expect(parent.getSnapshot().context.events).toEqual([{ type: 'INCORRECT', activeUser: 'user' }]);
    question.send({ type: 'NEXT' });
    expect(parent.getSnapshot().context.events.at(-1)).toMatchObject({ type: 'NEXT', state: 'incorrect' });
  });

  it('forwards retry text and permits a later successful submission', () => {
    const { parent, question } = host({}, true);
    jump(question);
    question.send({ type: 'USER_INPUT', userInput: 'attempt' });
    expect(question.getSnapshot().matches({ WaitingForInput: 'Waiting' })).toBe(true);
    expect(parent.getSnapshot().context.events).toEqual([{ type: 'TRY_AGAIN', activeUser: 'user', typedAnswer: 'attempt' }]);
    question.send({ type: 'USER_INPUT', userInput: 'Jesus' });
    expect(question.getSnapshot().matches('Correct')).toBe(true);
  });

  it('times out at the configured seconds without restarting the deadline on retries', () => {
    const { parent, question } = host({}, true);
    jump(question);
    vi.advanceTimersByTime(1500);
    question.send({ type: 'USER_INPUT', userInput: 'attempt' });
    vi.advanceTimersByTime(499);
    expect(question.getSnapshot().matches({ WaitingForInput: 'Waiting' })).toBe(true);
    vi.advanceTimersByTime(1);
    expect(question.getSnapshot().matches('Incorrect')).toBe(true);
    expect(parent.getSnapshot().context.events.at(-1)).toEqual({ type: 'INCORRECT', activeUser: 'user' });
  });

  it('does not time out in untimed mode', () => {
    const { parent, question } = host({ isQuestionTimed: false, timerLength: 0 });
    jump(question);
    vi.advanceTimersByTime(120_000);
    expect(question.getSnapshot().matches({ WaitingForInput: 'Waiting' })).toBe(true);
    expect(parent.getSnapshot().context.events).toEqual([]);
  });
});
