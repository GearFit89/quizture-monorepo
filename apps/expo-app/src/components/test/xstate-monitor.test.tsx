import { expect, it, vi } from 'vitest';
import { createActor, createMachine } from 'xstate';
import { getMonitorEvents } from '../monitor-events';

vi.mock('@xstate/react', () => ({ useSelector: (actor: any, selector: any) => selector(actor.getSnapshot()) }));
vi.mock('@/context', () => ({ RootActorContext: {} }));
vi.mock('react-native', () => ({
  View: 'view', Text: 'text', ScrollView: 'scroll-view', TouchableOpacity: 'button',
  StyleSheet: { create: (styles: unknown) => styles }, Platform: { OS: 'web' },
}));
import { MachineMonitorPanel } from '../xstate-monitor';

it('reads and deduplicates declared events from live v5 active states', () => {
  const actor = createActor(createMachine({
    initial: 'waiting', on: { RESET: '.waiting' },
    states: {
      waiting: { on: { RESET: 'waiting', NEXT: 'finished' }, after: { 1000: 'finished' } },
      finished: { type: 'final' },
    },
  })).start();
  try {
    expect(getMonitorEvents(actor.getSnapshot()).sort()).toEqual(['NEXT', 'RESET']);
    expect(() => MachineMonitorPanel({ actorRef: actor })).not.toThrow();
    actor.send({ type: 'NEXT' });
    expect(getMonitorEvents(actor.getSnapshot())).toEqual([]);
  } finally { actor.stop(); }
});
it('falls back safely for non-machine and missing snapshots', () => {
  for (const snapshot of [undefined, null, {}, { status: 'active', context: {} }, { _nodes: [{}] }]) {
    expect(getMonitorEvents(snapshot)).toEqual([]);
  }
});
it('supports legacy lists without exposing malformed or internal events', () => {
  expect(getMonitorEvents({ nextEvents: ['NEXT', 'NEXT', null, 1, '', 'xstate.after.100'] })).toEqual(['NEXT']);
  expect(getMonitorEvents({ status: 'stopped', nextEvents: ['NEXT'] })).toEqual([]);
});
it('renders an initialized actor without nextEvents using the empty fallback', () => {
  const actor = createActor(createMachine({})).start();
  try {
    expect(getMonitorEvents(actor.getSnapshot())).toEqual([]);
    expect(() => MachineMonitorPanel({ actorRef: actor })).not.toThrow();
  } finally { actor.stop(); }
});
