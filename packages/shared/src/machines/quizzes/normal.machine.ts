import { QuizScore, QuizSettings } from "../../types";
import type {
  QuizQuestion,
  Question,
  ScoreConfig,
  QuestionState,
  QuizScoreUser,
  UserState,
  QuizQuestionState,
  DifficultyLevel,
} from "../../types";
import { createMachine, setup, assign, fromPromise } from "xstate";
import { normalQuestionMachine, QuestionMachineContext } from "../questions/normal.machine";
import defaultScoreConfig from "../../score-config";
import { getQuizQuestions } from "../../logic/load-questions";
import { scoreQuestion } from "./actions";

export interface QuizLoadInput {
  quizLength: number;
  questions: Question[];
}
export interface QuizMachineContext {
  score: QuizScore;
  scoreConfig: ScoreConfig;

  incomingQuesions: QuizQuestion[];
  completedQuestions: QuizQuestion[];

  quizLength: number;

  activeUser: string;
  timerLength: number;
  difficulty: DifficultyLevel;
  initialQuestions?: Question[];
}
export interface QuizNextQuestionEvent<T> {
  type: T;
  state: QuizQuestionState;
  owner: string;
  typedAnswer: string;
}
export interface QuizQuestionEvent<T> {
  type: T;
  activeUser: string;
}
export type QuizEvent =
  | { type: "LOAD"; filteredQuestions?: Question[] }
  | QuizNextQuestionEvent<"NEXT">
  | QuizQuestionEvent<"CORRECT">
  | QuizQuestionEvent<"INCORRECT">
  | (QuizQuestionEvent<"TRY_AGAIN"> & { typedAnswer: string })
  | { type: "COMPLETE" };
export interface QuizInput {
  quizLength: number;
  userId?: string;
  difficulty?: DifficultyLevel;
  questions?: Question[];
  scoreConfig?: ScoreConfig;
  isQuestionTimed: boolean;
}
export const normalQuizMachine = setup({
  types: {
    context: {} as QuizMachineContext,
    events: {} as QuizEvent,
    input: {} as QuizInput,
  },
  actions: {
    handleIncorrect: assign({
      score: ({ context, event }) => {
        // While dangerous the "as" works,
        // because the questionMachine calls this event and QuizEvent brings type safety
        const quizEvent = event as { activeUser: string };

        return {
          ...context.score,
          [quizEvent.activeUser]: scoreQuestion(
            "incorrect",
            context,
            quizEvent.activeUser,
          ),
        };
      },
    }),
    handleCorrect: assign({
      score: ({ context, event }) => {
        const quizEvent = event as { activeUser: string };

        return {
          ...context.score,
          [quizEvent.activeUser]: scoreQuestion(
            "correct",
            context,
            quizEvent.activeUser,
          ),
        };
      },
    }),
    handleTryAgain: assign(({ context, event }) => {
      if (event.type !== "TRY_AGAIN") return {}; // {} Meets the type in `assign`
      const { incomingQuesions } = context;
      // Pull the first question from the list. (Basically .pop())
      const [currentQuestion] = incomingQuesions;

      const changedQuestion = {
        ...currentQuestion,
        typedAnswers: [
          ...(currentQuestion.typedAnswers || []),
          event.typedAnswer,
        ],
      } as QuizQuestion;

      return {
        incomingQuesions: [changedQuestion, ...incomingQuesions.slice(1)],
      };
    }),
    nextQuestion: assign(({ context, event }) => {
      if (event.type !== "NEXT") return {};
      const { state, owner, typedAnswer } = event;
      const [currentQuestion, ...remainingQuestions] = context.incomingQuesions;

      const changedQuestion: QuizQuestion = {
        ...currentQuestion,
        state,
        owner,
        typedAnswers: [...(currentQuestion.typedAnswers || []), typedAnswer],
      };
      return {
        completedQuestions: [changedQuestion, ...context.completedQuestions],
        incomingQuesions: remainingQuestions,
      };
    }),
  },
  actors: {
    loadingQuizActor: fromPromise(
      async ({ input }: { input: QuizLoadInput }) => {
        return await getQuizQuestions(input?.questions, input?.quizLength);
      },
    ),
    questionActor: normalQuestionMachine,
  },
  guards: {
    isQuizDone: function ({ context }) {
      return context.incomingQuesions.length <= 1;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXggdgewCcBbAQwBsA6ASQnTLAGIAZAeQEEARAbQAYBdRKAAOeWOgAu6PDkEgAHogAsATgoAOAExrlAdh4BmNfoBsPZQYA0IAJ6IN+gIwUNDnhuNqArGrMaennQBfQKs0LFxCUkoaOkZeASQQETFJaVkFBA1FRXUtZWNdQwdlQytbBB0HY3Vss30eAuNFY2DQjGx8YnIKMjwSWhwoBghpMAp0HAA3PABrMd7+gDlI8gBFdvjZZIkpGUSM-XMKfUV9HRPjHUVPA2UyxFdqnmeeB08NG8qHNVaQMI6VpQFgMhiMcGMJtM5j0+hBll0yOssFwHAlhKIdml9og1GonjodJ5jI4TvUSvcEABaLQ5TTFAKmD5va6-f4RBEw-oTIZgAgEQgUIRkEjiABmkU5cMBSMwm0S21Se1ABx0qm+RkOxmMDhcKh0FMp9NyijUegcBP0nhNnlZ7XZUQoJAAxpJJnF+FsMYr0ogAhoKAytNoSVqDUbNCazRarV5beFOg7na6xus4IruQwAMIsABKOYAopmACpy9EpXY+zInGouHjZd76WueA0aZROVXaLTvZqaK1xgEcpPoN0UVOwdODBhURbZvOFkse+VeivYhDmtQUSoNc0BKrXZoUok8TdqN4lBr5Zr9+3dIcjscToZFnMATQA+mwAOJsaelpLLrFlRxYpN38L5WxOU59ApHcKGuIxXD0YxPBKN5rwTW8XWHFNUDTXYM0WfMAA0FzRf9y0A+REENY8VAcfQTB0IxiXozQDROHQKF0dw3H8ZRzB+EI-jtDDKDvHC8OkAjiJLVFPQopUqIQHgKVxAMXhNZQXGJAwgl+fAIDgWQ2VE+TMUUjIaM8Y5FFbVwGNNLxLBsajmmqDtdHyD4mKaRR0MBahaHoMzvVXZpcm0ApzlPEpVQpOznFcdwvB8LSwP8jlgW5EKVyAqkAhsuyDEMJibmgly1xcTckscS4PitS4MsTLC3RyyjLJNdjVWcZRtCuTyGIcBwmsw5NR1w8d8MGNqLMQFSKvyEbKFFEhYggGbK0pAqTiKhzSuc8o9ByJiz3qRpmmGoSTIC0UJnQWAAAtIA21cdR8CgeDxLJ4P8epyvKE19GOT6zk8IbFG+LRgmCIA */
  context: ({ input }) => ({
    score: {},
    incomingQuesions: [],
    completedQuestions: [],
    currentQuestionIndex: 0,
    // TODO: Add seconds based on difficulty level
    timerLength: input.isQuestionTimed ? 30 : Infinity,
    quizLength: input.quizLength,
    scoreConfig: input.scoreConfig ?? defaultScoreConfig,
    activeUser: input.userId ?? "solo",
    difficulty: input.difficulty ?? "easy",
    initialQuestions: input.questions ?? [],
  }),
  id: "quiz:normal",
  initial: "Idile",
  states: {
    Idile: {
      always: {
        guard: ({ context }) => context.initialQuestions !== undefined,
        target: "Loading",
      },
      on: {
        LOAD: "Loading",
      },
    },

    Loading: {
      invoke: {
        id: "loadNormalQuiz",

        input: ({ context, event }) => {
          const questions =
            "filteredQuestions" in event
              ? (event.filteredQuestions ?? [])
              : (context.initialQuestions ?? []);
          return {
            questions: questions,
            quizLength: context.quizLength,
          };
        },

        onDone: [
          {
            guard: ({ event }) => event.output.length === 0,
            target: "Failed",
          },
          {
            target: "Active",
            actions: assign(({ event }) => ({
              incomingQuesions: event.output,
              // Explictly define [] to ensure that it is empty
              completedQuestions: [],
            })),
          },
        ],
        onError: "Failed",

        src: "loadingQuizActor",
      },
    },

    Active: {
      initial: "Questioning",
      always: {
        guard: ({ context }) => context.incomingQuesions.length === 0,
        target: "#quiz:normal.Summary",
      },
      states: {
        Questioning: {
          invoke: {
            id: "questionNormalQuiz",

            input: ({ context: ctx }) => {
              const [currentQuestion] = ctx.incomingQuesions;
              return {
                question: {
                  head: currentQuestion.head,
                  body: currentQuestion.body,
                  answer: currentQuestion.answer,
                },

                userInput: "",
                activeUser: ctx.activeUser,
                state: "none",
                type: "normal",
                displayedCharsArr: [],
                incommingCharsArr: Array.from(currentQuestion.body),
                isQuestionTimed: ctx.timerLength !== Infinity,
                timerLength: ctx.timerLength,
              } satisfies QuestionMachineContext;
            },

            src: "questionActor",
          },

          on: {
            // Targetless transitions handle events from the child without re-invoking it
            CORRECT: {
              actions: "handleCorrect",
            },
            INCORRECT: {
              actions: "handleIncorrect",
            },
            TRY_AGAIN: {
              actions: "handleTryAgain",
            },
            NEXT: [
              {
                guard: "isQuizDone",

                target: "#quiz:normal.Summary",
                actions: "nextQuestion",
              },
              {
                reenter: true,
                target: "Questioning",
                actions: "nextQuestion",
              },
            ],
          },
        },
      },
    },

    Failed: {
      type: "final",
    },
    Summary: {
      on: {
        COMPLETE: {
          target: "Finished",
        },
      },
    },

    Finished: {
      type: "final",
    },
  },
});
