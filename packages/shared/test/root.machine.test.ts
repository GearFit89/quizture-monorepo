import { afterEach, describe, expect, it } from 'vitest';
import { createActor, createMachine, type ActorRefFrom } from 'xstate';
import { rootMachine } from '../src/machines/root.machine';

const success = createMachine({ type: 'final' });
const failure = createMachine({ entry: () => { throw new Error('Actor failed'); } });
const actors: ActorRefFrom<typeof rootMachine>[] = [];
afterEach(() => { actors.splice(0).forEach((actor) => actor.stop()); });

function start(cookieSuccess = true, loginSuccess = true) {
  const actor = createActor(rootMachine.provide({ actors: {
    checkCookies: cookieSuccess ? success : failure,
    loginUser: loginSuccess ? success : failure,
    signUpUser: success,
  } }));
  actors.push(actor);
  actor.start();
  return actor;
}

describe('root machine', () => {
  it('authenticates after successful cookie checking and logs out', () => {
    const actor = start();
    expect(actor.getSnapshot().matches({ Auth: 'Authenticated' })).toBe(true);
    actor.send({ type: 'LOGOUT' });
    expect(actor.getSnapshot().matches({ Auth: { Unauthenticated: 'Idle' } })).toBe(true);
  });

  it('allows guest entry and exit after cookie checking fails', () => {
    const actor = start(false);
    expect(actor.getSnapshot().matches({ Auth: { Unauthenticated: 'Idle' } })).toBe(true);
    actor.send({ type: 'SELECT_GUEST_MODE' });
    expect(actor.getSnapshot().matches({ Auth: 'Guest' })).toBe(true);
    actor.send({ type: 'LEAVE_GUEST' });
    expect(actor.getSnapshot().matches({ Auth: { Unauthenticated: 'Idle' } })).toBe(true);
  });

  it('authenticates through LOGIN or SIGN_UP with successful actors', () => {
    const actor = start(false);
    actor.send({ type: 'LOGIN' });
    expect(actor.getSnapshot().matches({ Auth: 'Authenticated' })).toBe(true);
    actor.send({ type: 'LOGOUT' });
    actor.send({ type: 'SIGN_UP' });
    expect(actor.getSnapshot().matches({ Auth: 'Authenticated' })).toBe(true);
  });

  it('returns to unauthenticated when the login actor fails', () => {
    const actor = start(false, false);
    actor.send({ type: 'LOGIN' });
    expect(actor.getSnapshot().matches({ Auth: { Unauthenticated: 'Idle' } })).toBe(true);
    expect(actor.getSnapshot().status).toBe('active');
  });

  it.each(['NETWORK_OFFLINE', 'ON_CONNECTION_FAILED'] as const)('goes offline on %s and stops its background actor', (type) => {
    const actor = start();
    const background = actor.getSnapshot().children['online.background']!;
    actor.send({ type });
    expect(actor.getSnapshot().matches({ Connection: 'Offline' })).toBe(true);
    expect(background.getSnapshot().status).toBe('stopped');
    expect(actor.getSnapshot().children['online.background']).toBeUndefined();
    expect(actor.getSnapshot().matches({ Auth: 'Authenticated', Activity: 'Idle' })).toBe(true);
  });

  it.each(['NETWORK_ONLINE', 'CONNECTION_REGAINED'] as const)('reconnects on %s with a new background actor', (type) => {
    const actor = start();
    const oldBackground = actor.getSnapshot().children['online.background'];
    actor.send({ type: 'NETWORK_OFFLINE' });
    actor.send({ type });
    expect(actor.getSnapshot().matches({ Connection: 'Online' })).toBe(true);
    expect(actor.getSnapshot().children['online.background']).toBeDefined();
    expect(actor.getSnapshot().children['online.background']).not.toBe(oldBackground);
  });

  it.each(['SELECT_SOLO', 'SELECT_MUTLIPLAYER'] as const)('opens the quiz selection state on %s', (type) => {
    const actor = start();
    actor.send({ type });
    expect(actor.getSnapshot().matches({ Activity: { Quizzing: 'Active' } })).toBe(true);
  });

  it.each([
    ['PRACTICE_QUIZ', 'Practice', 'solo.practice'],
    ['STUDY', 'Study', 'solo.study'],
    ['FLASHCARDS', 'Flashcards', 'solo.flashcards'],
  ] as const)('routes %s to its matching invoked child', (type, state, childId) => {
    const actor = start();
    actor.send({ type: 'SELECT_SOLO' });
    actor.send({ type });
    expect(actor.getSnapshot().matches({ Activity: { Quizzing: state } })).toBe(true);
    expect(actor.getSnapshot().children[childId]).toBeDefined();
  });

  it('returns to activity idle after a practice child completes', () => {
    const actor = createActor(rootMachine.provide({ actors: { OfflineQuiz: success } }));
    actors.push(actor);
    actor.start();
    actor.send({ type: 'SELECT_SOLO' });
    actor.send({ type: 'PRACTICE_QUIZ' });
    expect(actor.getSnapshot().matches({ Activity: 'Idle' })).toBe(true);
    expect(actor.getSnapshot().children['solo.practice']).toBeUndefined();
  });
});
