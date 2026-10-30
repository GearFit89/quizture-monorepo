import { setup } from "xstate";
interface TimerMachineContext {
  timerLength: number;
}
interface TimerMachineEvents {
  type: "START" | "OFF" | "RESTART";
}
export const machine = setup({
  types: {
    context: {} as TimerMachineContext,
    events: {} as TimerMachineEvents,
    input: {} as TimerMachineContext,
  },
  delays: {
    timerLengthDelay: ({ context }) => context.timerLength,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAdASQgBswBiAZQBUBBAJQoG0AGAXUVAAcB7WVNTgOzYgAHogDMADgCsOAOxiALJKljGUhQCYAjLNkAaEAE9x2nFMYXGGgJwTrGsbIkBfZwbSZcNAK79+qfigSYVhkAENkMBwwgDNIrAAKD2wAGTBA5AALABEwQjDDAEoSZK9ff0CmViQQLh4+QRrRBGU5RWVVdW1dA2MECS0zS0YtdUUANg1x2Vd3DGwcbIFSAHkAMTWqoTreVAEhZtGZYcZVBSdzMTFek0HzSxs7BydZkFLF5ZIaAFFKWgYWNtuLt9k1EEccCczhdTtcjIgNBY5PcrM9GAoFK43CB+JwIHAhKUgfU9o1QM0ALTjG4ICkyawMxlMpliV7vAjEYkgskiBESWRtJQSDQaKSyMVaDE0sQiyHDR72RwubHvHx+AJQLkNA6IMUKHDjBSMQ06LQWKT2GmIsTIh5ojFs+a4Jb8MBa0k6hCaGkSCQ4fn3LQScaMaznRgzLFAA */
  context: ({ input }) => ({
    timerLength: input?.timerLength || 5000,
  }),
  id: "timer",
  initial: "Idle",
  states: {
    Idle: {
      on: {
        START: {
          target: "Running",
        },
      },
    },
    Running: {
      after: {
        timerLengthDelay: {
          target: "Done",
        },
      },
    },
    Done: {
      on: {
        OFF: {
          target: "Idle",
        },
        RESTART: {
          target: "Running",
        },
      },
    },
  },
});
