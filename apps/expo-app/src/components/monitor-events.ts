/** Event names declared by active state nodes; guards and event payloads still apply. */
export function getMonitorEvents(snapshot: unknown): string[] {
  if (!snapshot || typeof snapshot !== 'object') return [];
  const state = snapshot as { status?: string; nextEvents?: unknown; _nodes?: unknown };
  if (state.status && state.status !== 'active') return [];

  let events: unknown[] = [];
  if (Array.isArray(state._nodes)) {
    events = state._nodes.flatMap((node) =>
      node && Array.isArray(node.ownEvents) ? node.ownEvents : []);
  } else if (Array.isArray(state.nextEvents)) {
    events = state.nextEvents;
  }

  return [...new Set(events.filter((event): event is string =>
    typeof event === 'string' && event.length > 0 && !event.startsWith('xstate.')))];
}
