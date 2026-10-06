import { setup, sendParent, assign, raise, enqueueActions } from "xstate";
import { checkAnswer } from "@/logic";
import { QuizEvent, QuizMachineContext } from "../quizzes/normal.machine";
import { QuizQuestionState } from "@/types";

export type QuestionEventState = "CORRECT" | "INCORRECT" | "TRY_AGAIN";

export interface QuestionMachineContext {
  question: {
    head: string;
    body: string;
  };
  userInput: string;
  timerLength: number;
  isQuestionTimed: boolean;
  questionHeader: string;
  questionBody: string;
  type: string;

  state: QuizQuestionState;

  answer: string;

  activeUser: string | null;
  // If the head is displayed, the value wil be cosumed by the UI,
  // as long as the mahince assigns the headDisplay.

  headDisplay?: string;

  incommingCharsArr: string[];
  displayedCharsArr: string[];
}
export const questionMachine = setup({
  types: {
    context: {} as QuestionMachineContext,
    input: {} as QuestionMachineContext,
    events: {} as
      | { type: "DISPLAY_CHAR" }
      | { type: "START_BODY_CHARS" }
      | { type: "CORRECT" }
      | { type: "INCORRECT" }
      | { type: "TRY_AGAIN" }
      | { type: "JUMP" , username: string}
      | { type: "USER_INPUT"; userInput: string }
      | { type: "DISPLAY_DONE" }
      | { type: "NEXT" },
  },
  delays: {
    timeUntilIncorrect: 30_000, // 30 seconds
    timeBetweenChars: 300 // 300 milliseconds

  },
  actions: {
    displayQuestion: () => {
      // Add your action code here
    },
    checkInput: enqueueActions(({ enqueue, context: ctx }) => {
      const result = checkAnswer(ctx.answer, ctx.userInput);

      // Enqueue the internal event back to this machine
      enqueue.raise({
        type: result.EVENT, // The all caps event CORRECT| INCORRECT| TRY AGAIN
      });
    }),
    sendIncorrectToQuiz: ({ context }) => {
      return sendParent({
        type: "INCORRECT",
        activeUser: context.activeUser,
      } as QuizEvent);
    },
    sendCorrectToQuiz: ({ context }) => {
      return sendParent({
        type: "CORRECT",
        activeUser: context.activeUser,
      } as QuizEvent);
    },
    endQuestion: ({ context: ctx }) =>
      sendParent({
        type: "NEXT",
        state: ctx.state,
        owner: ctx.activeUser,
        typedAnswer: ctx.userInput,
      } as QuizEvent),
    setActiveUser: assign(({ event }) => {
      if(event.type !== "JUMP") return {};
      return {
        activeUser: event.username, // send_ type: "JUMP", username }
      }}),
  },

  guards: {
    isQuestionTimed: function ({ context }) {
      return context.isQuestionTimed;
    },
    isCharsDone: ({ context }) => {
      return context.incommingCharsArr.length === 0;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCucAuBLA9gOwTxwCcBbAQwBsA6AES1gAdLyBPLPKARXVm3zoNmbABJhyEAMQBlACoBBAEqyA+gCEA8rQCaKgMIil0gNoAGALqJQjHLCz88VkAA9EATgDs1AGwBmAEwArG7ept4AHIEALOExADQgrIi+plHUvp4AjOGm0f7ZUZ4AvkUJaJi4BERkVIJMLOycPBUC9PVsajgQrJK0AJLSAAoAMvK6BkpmlkggNnYOTq4IUf7UmfmBvr4ewbFu4QlJCH6+1B7egak5mane3pklZbwOhCQUNG3CjdzPlXVfnW6vQGIzG+kMimMmWm1ls9kqi0Q-nCmWohTuHl8gQ82Uybkyh0QNzc1DcgWC2U2ZIigQepRA5T4lVeNRoAHVyPDOAAxEgAKVQpEYkj5AFUALKDKZOObw-CIhC0wJnDymNxRXL+Nxbc6E45hNbhDweZE3Y13fyPBm-fAs97UDlcqC84h9PCMVAYSTOPjkDBgajkABm-uIAAoUqYowBKSSMl7Ve2O7A8khuj0YaUzWULGZLfzeEm+TLnbb7daxUwePXZVa07zmo03KIecLhK3x5mJ2rJjjOtPuz0OzkpqCSUXSACiihUfQAcoNRbIs7D5giZkd1kWYv5TG2cv5i5EEksALSH1ERDwrDzau6xPwdm1VN49kd9l3pod6AAWYAAxgA1n2X5erIii6PIADi8jziusxwrmoD5saPixJkUSBKE6pBP4eoaqsGRBBhpgZCiUSZN4T4tC+rLDk6n6Dhg1C-gBwGcKBkjznoGiKIok56MuFgyoh67IYgp6ZJc6TXm4-i3r495RH4Nb4tQsThLu+6mBekTUUytrduy76pq6TEsX+QEgUxkg8XxAlCTCCFrvKeYSVJpgyYU8l3hEym+KpqIaVpbY6UegT6Qmr40G6-4kMQAFenOk4ABqOSJLmOG5CCSSs1CmFJ5JaopfnYvh+TpDue6hbpkVdtFLHxYlkjJWl8E5mJLjuYUpIRA2ClKWViSIDEpzBdVB5HiU9JEBAcBOJ2hnRRlcpZeJOWbMqWoRDpvkPnqklBKSbgnXJgThHcdwrHVS10Z8DR9s0Blrc5q0KqeMReNtB57Zh1bDTlvjhGip0hPJMT3P4yk3bR9r3Wwj3Pv8DRiBIK1IV1OVRBk1DfbtJWxENRwhDDdq1PD3xPQ4yMdF0Ryrm92UfTjePFYN-1HIenmFKDvMnR4pNGfRo4ugKQro51SyfaSeKKa2uRVhEAUA5dhrGqaVbnN4lr0otsNvgxA4ZhLrnrR9Rq4yEP0E8p+FBTEeI3JphbyRcgsNb2pmgcLfYmy9Z7YySrO-d4NZapVmkTWFlLu3Rnv9mZGYWWx1nG9momm5jzNB1b+NKaHAMFmNVXabVuvPmTMV4HFxAJf+GB++90vBzbRPuNEasmiimtXbH9p6E19eN0zze52zpUc0SmRYmh6vd+a3hRH35P4GAw9m6PO3j4Tk8INPJadxrC9L9NQA */
  context: ({ input }) => input,
  id: "question:normal",
  initial: "DisplayingQuestion",
  states: {
    DisplayingQuestion: {
      initial: "DisplayHead",
      states: {
        DisplayHead: {
          on: {
            START_BODY_CHARS: {
              target: "DisplayBody",
            },
          },
        },
        DisplayBody: {
          after: {
            timeBetweenChars: [
              {
                target: "#question:normal.WaitingForJump",
                guard: "isCharsDone",
              },
              {
                target: "DisplayBody",
              },
            ],
            
          },
        },
      },

      entry: "displayQuestion",
    },
    WaitingForJump: {
      on: {
        JUMP: {
          target: "WaitingForInput",
          reenter: true,
          actions: "setActiveUser"
        },
      },
    },
    WaitingForInput: {
      initial: "Waiting",
      after: {
        timeUntilIncorrect: {
          target: "Incorrect",
          guard: {
            type: "isQuestionTimed",
          },
        },
      },
      states: {
        Waiting: {
          on: {
            USER_INPUT: {
              target: "CheckingInput",
            },
          },
        },

        CheckingInput: {
          on: {
            TRY_AGAIN: {
              target: "Waiting",
            },
            INCORRECT: {
              target: "#question:normal.Incorrect",
            },
            CORRECT: {
              target: "#question:normal.Correct",
            },
          },
          entry: {
            type: "checkInput",
          },
        },
      },
    },
    Incorrect: {
      entry: "sendIncorrectToQuiz",
      on: {
        NEXT: {
          target: "Done",
        },
      },
    },
    Correct: {
      entry: "sendCorrectToQuiz",
      on: {
        NEXT: {
          target: "Done",
        },
      },
    },
    Done: {
      entry: "endQuestion",
      type: "final",
    },
  },
});
