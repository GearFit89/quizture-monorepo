import { setup, sendParent, assign, enqueueActions } from "xstate";
import { checkAnswer } from "../../logic/answer-checker";
import type { QuizEvent } from "../quizzes/normal.machine";
import type { QuizQuestionState } from "../../types/question";

const START_QUESTION_WORD = 'Question: '
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
      | { type: "NEXT" },
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
      startQuestionDisplay: ({ context }) => context.startQuestion ?? START_QUESTION_WORD,
    }),
    displayChar: assign(({ context }) => {
      const [ nextChar, ...remainingChars ] = context.incommingCharsArr

          return {
            displayedCharsArr: nextChar === undefined ? context.displayedCharsArr : [...context.displayedCharsArr, nextChar],
            incommingCharsArr: remainingChars
          }
        }),

    checkInput: enqueueActions(({ enqueue, context: ctx }) => {
      const result = checkAnswer(ctx.question.answer, ctx.userInput);

      // Enqueue the internal event back to this machine
      enqueue.raise({
        type: result.EVENT, // The all caps event CORRECT| INCORRECT| TRY AGAIN
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

    endQuestion: sendParent(({ context: ctx }) => ({
        type: "NEXT",
        state: ctx.state,
        owner: ctx.activeUser,
        typedAnswer: ctx.userInput,
      }) satisfies QuizEvent),
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
  },
}).createMachine({
  context: ({ input }) => input,
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
          after: { timeBeforeQuestionSkip: { target: "#question:normal.Done" } },
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
            TRY_AGAIN: {
              target: "Waiting",
              actions: sendParent(({ context }) => ({
                type: "TRY_AGAIN",
                activeUser: context.activeUser,
                typedAnswer: context.userInput,
              }) satisfies QuizEvent),
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
      },
    },
    Done: {
      entry: "endQuestion",
      type: "final",
    },
  },
});
