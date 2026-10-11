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
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCucAuBLA9gOwTxwCcBbAQwBsA6AES1gAdLyBPARXVm3wAkxyEAMQAPbuQxhq5AGaTiACmykwAITAYA7mDB5+ggIJ4IAZQzliGAJRC0mXASJkqdBszad7fARADaABgBdRFBGHFgsHjwQkBFEACYAVgBGan8AFgA2AA5sgHYAZkz0vIzkzIAaEFZEZP9MtP8m-2zk8qy8zIBfLqq7bgdCEgoaeiYWDi4oswsMUXFJaTkwRWU1DW1dGcsjCE8B-ABhAAsLWBt+qKHnUbcJ-enzSwDgpBAwiKiYuIRS1PT4slcnlWn8ilUagg6g1mk1Wu1Mp0en0poMnCNqAB1ciRLB4KAAMRIAClUKRGEJiQBVACyAAUXjEPrj8N9ENkAJz+NIcgp5DmcgqJEoQxDpZJ5ahZXKZRJ5IEFBXIkCXNHDFzY3H4onEUnk1zjNgnM7zcyLWTyJRYFTqLQ6PDG4jnWyo-DXDGa7DaklkxgG9ysR2wRlvZlfN4-AocxLUFKJYrpRIFKMJ0W-FLUPmJerxAr+DnpdK85Wqt3ojU4r2En36sYBoOmiRSC0rK02jb2oMXV2OdU0T146u633+iZB3zJV6hcIs6IR9l5NOI9KZvLZpP+NfZRKJDklnvuitaod6v1B2j4MCN83LVbW9YyEhgB4OEwAaywjG7Xl7NyxlcHHVT2oc9LxDadPgcNkEE5bl8z5AVeWFRdqkQNdUizHM8wLdJOX3H9D37ADvWIABJPBGFQOYxDNZtbzbMAqTwbBKHIgBjEhiDANjrBdAjyyI48dXIyiMHA94Z3DUAfmSeMOWoHI1w5coCniVpoyXVTqGSJJ-F3AFOkSfJ8IOX8PWIocRKo-9jyEKkTAAUQAJQAfVIgA5OkqQAFXEsMoPnKEgUlQpCwKbJ0ijTl4jTHcCljTIkm3dJ-HiTcdJMq4BJsqthIo6yTm4j98SsuZvKcgBNFyDAAcQMDy-MkgLpNqZIOQaYp0viFKOTUzk00TSVs38Op4x0rl4mKTK1T-AcSNKkDjiKwdSqEDzDgAeScpyHMOXygiZJrWUC2TMnkxTdxUtS2sSWK6ilEoOWU+InvlIzprLPscsAkgFsKtjiqgVbNu23b9qnCTIOOlqoTkhT8kuzJVPU27UIQRN5ILfl2uySbUtKPIPrMlx2M47i5nchyAA1wcOqG5xhxIYrRtohWoBH6kyEbEUVZIicIkCyZ4oRKZpxr6egxK0zqbdV2zN7IoySael6EAiAgOAYlLYnKDp2doIAWg5NMDZjJ7zYti3ZP57K63uHt9AgPWpNiMVmchVpY2aLJEx97dEhtr67Y8HttgwZ3mtd9GC3ZtcmiLbIRoKNNPaLJ7EuycLJviZXVe1gW5pPX0I+hqOo1i7IGg5znATSvJ0kD2aLKAkdg8DU4nRLhmo+SSLqC5RKufjcKEbTPJJtj9dcijSL5Ub8yhJrM8O9gC88DALvoPH1Icx3XHEz0xUx+zOX6n5YUox3eej1y378vD0Mju7mT8e03T43qXvE+TtG+Tg5pLpGSSOKa+glb5kXvt9fEm8TqbhjDpdcXNMhf38D-SEuEGhFGlPUXGvVxQFFAVAyykD-qA1KjAmGyQCiJmoIZUoKRE7QnSANQo2kBSoKMm0euhRCGk2IFxHiFCe54P7hFLIeZMjILUu7RAcoYxpUzjnZMAJFKEMOELB+EF9YnW3uzfS6l6hFkRANXM-dcKpUmhyEE48A55wPLbS8QiZKyjSKdIU4VIoFmMSzNK8kEG9xUkzCK2QVZdCAA */
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
