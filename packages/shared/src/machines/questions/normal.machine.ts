import { setup, sendParent, assign, enqueueActions } from "xstate";
import { checkAnswer } from "../../logic/answer-checker";
import type { QuizEvent } from "../quizzes/normal.machine";
import type { QuizQuestionState } from "../../types/question";

const START_QUESTION_WORD = "Question: ";
export type QuestionEventState = "CORRECT" | "INCORRECT" | "TRY_AGAIN";

export interface QuestionMachineContext {
  question: {
    head: string;
    body: string;
    answer: string;
  };
  userInput: string;
  timerLength: number;

  isQuestionTimed: boolean;

  type: string;

  state: QuizQuestionState;

  activeUser: string;
  // If the head is displayed, the value wil be cosumed by the UI,
  // as long as the mahince assigns the headDisplay.

  headDisplay?: string;
  startQuestion?: string;
  startQuestionDisplay?: string;

  incommingCharsArr: string[];
  displayedCharsArr: string[];

  maxRetryAttempts?: number;
  currentRetryAttempts?: number;
}
export const normalQuestionMachine = setup({
  types: {
    context: {} as QuestionMachineContext,
    input: {} as QuestionMachineContext,
    events: {} as
      | { type: "DISPLAY_CHAR" }
      | { type: "START_BODY_CHARS" }
      | { type: "CORRECT" }
      | { type: "INCORRECT" }
      | { type: "TRY_AGAIN" }
      | { type: "JUMP"; username: string }
      | { type: "USER_INPUT"; userInput: string }
      | { type: "DISPLAY_DONE" }
      | { type: "NEXT" }
      | { type: "RETRY" },
  },
  delays: {
    timeUntilIncorrect: ({ context }) => context.timerLength * 1000,
    timeBetweenChars: 300, // 300 milliseconds
    timeBetweenHeadAndStart: 50,
    timeBetweenStartAndQuestionsChars: 100,

    timeBeforeQuestionSkip: 5000, // 5 seconds
  },
  actions: {
    displayHead: assign({
      headDisplay: ({ context }) => context.question.head,
    }),
    displayStart: assign({
      startQuestionDisplay: ({ context }) =>
        context.startQuestion ?? START_QUESTION_WORD,
    }),
    displayChar: assign(({ context }) => {
      const [nextChar, ...remainingChars] = context.incommingCharsArr;

      return {
        displayedCharsArr:
          nextChar === undefined
            ? context.displayedCharsArr
            : [...context.displayedCharsArr, nextChar],
        incommingCharsArr: remainingChars,
      };
    }),

    checkInput: enqueueActions(({ enqueue, context: ctx }) => {
      const result = checkAnswer(ctx.question.answer, ctx.userInput);

      // Enqueue the internal event back to this machine
      enqueue.raise({
        type: "TRY_AGAIN", // The all caps event CORRECT| INCORRECT| TRY AGAIN
      });
    }),
    sendIncorrectToQuiz: sendParent(
      ({ context }) =>
        ({
          type: "INCORRECT",
          activeUser: context.activeUser,
        }) satisfies QuizEvent,
    ),

    sendCorrectToQuiz: sendParent(
      ({ context }) =>
        ({
          type: "CORRECT",
          activeUser: context.activeUser,
        }) satisfies QuizEvent,
    ),

    endQuestion: sendParent(
      ({ context: ctx }) =>
        ({
          type: "NEXT",
          state: ctx.state,
          owner: ctx.activeUser,
          typedAnswer: ctx.userInput,
        }) satisfies QuizEvent,
    ),
    setActiveUser: assign(({ event }) => {
      if (event.type !== "JUMP") return {};
      return {
        activeUser: event.username, // send_ type: "JUMP", username }
      };
    }),
  },

  guards: {
    isQuestionTimed: function ({ context }) {
      return context.isQuestionTimed;
    },
    isCharsDone: ({ context }) => {
      return context.incommingCharsArr.length === 0;
    },
    isQuestionTimedGuard: ({ context }) => {
      return context.isQuestionTimed;
    },
    hasRetryAttempts: ({ context }) => {
      return (
        
         (context.currentRetryAttempts ?? 0) <= (context.maxRetryAttempts ?? 1)
      );
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCucAuBLA9gOwTxwCcBbAQwBsA6AES1gAdLyBPARXVm3wAkxyEAMQAPbuQxhq5AGaTiACmykwAITAYA7mDB5+ggIJ4IAZQzliGAJRC0mXASJkqdBszad7fARADaABgBdRFBGHFgsHjwQkBFEACYAVgBGan8AFgA2AA5sgHYAZkz0vIzkzIAaEFZEZP9MtP8m-2zk8qy8zIBfLqq7bgdCEgoaeiYWDi4oswsMUXFJaTkwRWU1DW1dGcsjCE8B-ABhAAsLWBt+qKHnUbcJ-enzSwDgpBAwiKiYuIRS1PT4slcnlWn8ilUagg6g1mk1Wu1Mp0en0poMnCNqAB1ciRLB4KAAMRIAClUKRGEJiQBVACyAAUXjEPrj8N9ENkAJz+NIcgp5DmcgqJEoQxDpZJ5ahZXKZRJ5IEFBXIkCXNHDFzY3H4onEUnk1zjNgnM7zcyLWTyJRYFTqLQ6PDG4jnWyo-DXDGa7DaklkxgG9ysR2wRlvZlfN4-AocxLUFKJYrpRIFKMJ0W-FLUPmJerxAr+DnpdK85Wqt3ojU4r2En36sYBoOmiRSC0rK02jb2oMXV2OdU0T146u633+iZB3zJV6hcIs6IR9l5NOI9KZvLZpP+NfZRKJDklnvuitaod6v1B2j4MCN83LVbW9YyEhgB4OEwAaywjG7Xl7NyxlcHHVT2oc9LxDadPgcNkEE5bl8z5AVeWFRdqkQNdUizHM8wLdJOX3H9D37ADvWIABJPBGFQOYxDNZtbzbMAqTwbBKHIgBjEhiDANjrBdAjyyI48dXIyiMHA94Z3DUAfmSeMOWoHI1w5coCniVpoyXVTqGSJJ-F3AFOkSfJ8IOX8PWIocRKo-9jyEKkTAAUQAJQAfVIgA5OkqQAFXEsMoPnKEgUlQpCwKbJ0ijTl4jTHcCljTIkm3dJ-HiTcdJMq4BJsqthIo6yTm4j98SsuYPMOAB5JynIcw5fKCJlJIC6TajkhT8l3FS1OSDTUIQFJuULfllPiDkOXlIzMrVP8BxI0qQOOIrB1KoRKuq2r6qnCTINZQLZMyeTFM6zJVPUxI00TeSC2GnJ4kyVLSjyKayz7HLAJIebCrY4qoBW7ynIATRcgwAHEDA8vymt2lqoXFGM1zu7NlMS3c0zUmMeuyfwhXhPISgKZ6zKPXKPvyjAFqWkqyaEf6gdB8H3InLb-Oh2JEGjbIFMybmed5xE01k7k+eF7m916FUD2y2bLLJ6hvOIVgDCgHE8CEGqCXshyXJq2nIZ2ucYYAWh09IBb0xomiyRMre3J7xdLInBJJsjZflxXlbxNWHN1hrQyhg22YQO7tNOnTzr642ChXEXhbFlF+Ne6W8tEuWFaVlWvd1ydGv16D4lGzNkyL4ui9NvqMzGyuq+rwnCOodjOO4uZ3IcgANTac9naDEhivq2iFagOvqe7ykKNpa+yw5G54oQW-bvWu8CxKze3VdswmyKMjuifXqn4guJnnXAYXqTA8NlK00N+6enFogIDgGIHcIzvT5+Y28l7yFDewrmY+5u346mTrnWe4PZ9AQBfs1QOAI0ytFjM0K2wpijbkSDvP8ICPA9m2BgSBrMfhFhXEPDIAp-DJAKLA-4ldErZHCndfO3R7aS0ThZICvpcEB0jByWK2QGhDw3FuHcccJYJxmiwmsfoMGBlOE6dh0FkiRWoFyRK914zhQ6mmD+vC1x6VyFGSK8o0HmSEuIhaZwLx4DALIwKH9Ug5h3NkeIiY9KKg0dmNe9R+TCijDuQxxN3ou1ElYo2gJB6ImCuHL++d4jaT-jzIRT8pZiICdZaWQTA51DXNpXS8Z6jyKxuQvquEGhFGlPUBxHJHFkN8U7fxn1FrfWWmTNJMko7w1lKUFIWNoRl0hPjbSJCcZtDxoUapb05quzTh7AOLMOG1DIZzWUdRlJ1GBChSEqlolJjIQdeR2YsaylGQ3feTdmm1AqSuAUhYTrDx0g42KmS0o0PzsmAEilRl7wPjgv2uc9o2MHvpdS9Qiz80KbmRRuFUp3XGvkJIozzGWO+YvGG5QYykNUUmCKeiQWQh0vmLJKRxQnR7hFbIN8uhAA */
  context: ({ input }) => ({
    ...input,
    // Since currentAttempts is not required, this provides a fallback for it
    currentRetryAttempts: 0,
  }),
  id: "question:normal",
  initial: "DisplayQuestionHead",
  states: {
    DisplayQuestionHead: {
      after: {
        timeBetweenHeadAndStart: {
          target: "DisplayQuestionStart",
        },
      },
      entry: {
        type: "displayHead",
      },
    },

    DisplayQuestionStart: {
      after: {
        timeBetweenStartAndQuestionChars: {
          target: "WaitingForJump",
        },
      },
      entry: {
        type: "displayStart",
      },
    },

    WaitingForJump: {
      initial: "DisplayChars",
      on: {
        JUMP: {
          target: "WaitingForInput",
          actions: "setActiveUser",
        },
      },
      states: {
        DisplayChars: {
          after: {
            timeBetweenChars: [
              {
                target: "CharsDone",
                guard: {
                  type: "isCharsDone",
                },
              },
              {
                reenter: true,
                target: "DisplayChars",
              },
            ],
          },
          entry: {
            type: "displayChar",
          },
        },
        CharsDone: {
          after: {
            timeBeforeQuestionSkip: { target: "#question:normal.Done" },
          },
        },
      },
    },

    WaitingForInput: {
      initial: "Waiting",
      after: {
        timeUntilIncorrect: {
          target: "#question:normal.Incorrect",
          guard: "isQuestionTimedGuard",
        },
      },
      states: {
        Waiting: {
          on: {
            USER_INPUT: {
              target: "CheckingInput",
              actions: assign(({ event }) => ({ userInput: event.userInput })),
            },
          },
        },

        CheckingInput: {
          on: {
            INCORRECT: {
              target: "#question:normal.Incorrect",
            },

            CORRECT: {
              target: "#question:normal.Correct",
            },

            TRY_AGAIN: [
              {
                target: "TryAgain",
                guard: "hasRetryAttempts",
                actions: sendParent(
                  ({ context }) =>
                    ({
                      type: "TRY_AGAIN",
                      activeUser: context.activeUser,
                      typedAnswer: context.userInput,
                    }) satisfies QuizEvent,
                ),
              },

              {
                target: "#question:normal.Incorrect",
                actions: sendParent(
                  ({ context }) =>
                    ({
                      type: "TRY_AGAIN",
                      activeUser: context.activeUser,
                      typedAnswer: context.userInput,
                    }) satisfies QuizEvent,
                ),
              },
            ],
          },
          entry: {
            type: "checkInput",
          },
        },

        TryAgain: {
          on: {
            REFUSE_RETRY: {
              target: "#question:normal.Incorrect",
              reenter: true,
            },

            RETRY: {
              target: "Waiting",
              action: assign({
                currentAttmepts: ({ context }) => context.currentAttempts + 1,
              }),
            },
          },
        },
      },
    },

    Incorrect: {
      entry: [assign({ state: "incorrect" }), "sendIncorrectToQuiz"],
      on: {
        NEXT: {
          target: "Done",
        },
      },
    },

    Correct: {
      entry: [assign({ state: "correct" }), "sendCorrectToQuiz"],
      on: {
        NEXT: {
          target: "Done",
        },

        RETRY: {
          target: "WaitingForInput.Waiting",
          reenter: true,
        },
      },
    },

    Done: {
      entry: "endQuestion",
      type: "final",
    },
  },
});
