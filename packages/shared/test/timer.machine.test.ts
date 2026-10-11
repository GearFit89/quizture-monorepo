import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor, type ActorRefFrom } from 'xstate';
import { machine } from '../src/machines/timer.mahine';

let actor: ActorRefFrom<typeof machine>;
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { actor?.stop(); vi.useRealTimers(); });

function start(timerLength = 1000) {
  actor = createActor(machine, { input: { timerLength } });
  actor.start();
  return actor;
}

describe('timer machine', () => {
  it('waits for START and completes exactly at the configured duration', () => {
    start();
    vi.advanceTimersByTime(2000);
    expect(actor.getSnapshot().matches('Idle')).toBe(true);
    actor.send({ type: 'START' });
    vi.advanceTimersByTime(999);
    expect(actor.getSnapshot().matches('Running')).toBe(true);
    vi.advanceTimersByTime(1);
    expect(actor.getSnapshot().matches('Done')).toBe(true);
  });

  it('restarts a completed timer with the full duration', () => {
    start();
    actor.send({ type: 'START' });
    vi.advanceTimersByTime(1000);
    actor.send({ type: 'RESTART' });
    expect(actor.getSnapshot().matches('Running')).toBe(true);
    vi.advanceTimersByTime(999);
    expect(actor.getSnapshot().matches('Running')).toBe(true);
    vi.advanceTimersByTime(1);
    expect(actor.getSnapshot().matches('Done')).toBe(true);
  });

  it('returns to idle on OFF after completion and requires another START', () => {
    start();
    actor.send({ type: 'START' });
    vi.advanceTimersByTime(1000);
    actor.send({ type: 'OFF' });
    vi.advanceTimersByTime(2000);
    expect(actor.getSnapshot().matches('Idle')).toBe(true);
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().matches('Running')).toBe(true);
  });

  it('ignores repeated START while running rather than resetting elapsed time', () => {
    start();
    actor.send({ type: 'START' });
    vi.advanceTimersByTime(750);
    actor.send({ type: 'START' });
    vi.advanceTimersByTime(250);
    expect(actor.getSnapshot().matches('Done')).toBe(true);
  });

  it('uses the current 5-second fallback when given zero', () => {
    start(0);
    expect(actor.getSnapshot().context.timerLength).toBe(5000);
    actor.send({ type: 'START' });
    vi.advanceTimersByTime(4999);
    expect(actor.getSnapshot().matches('Running')).toBe(true);
    vi.advanceTimersByTime(1);
    expect(actor.getSnapshot().matches('Done')).toBe(true);
  });

  it('cancels scheduled transitions when the actor stops', () => {
    start();
    const listener = vi.fn();
    actor.subscribe(listener);
    actor.send({ type: 'START' });
    actor.stop();
    listener.mockClear();
    vi.advanceTimersByTime(2000);
    expect(listener).not.toHaveBeenCalled();
    expect(actor.getSnapshot().status).toBe('stopped');
  });
});
