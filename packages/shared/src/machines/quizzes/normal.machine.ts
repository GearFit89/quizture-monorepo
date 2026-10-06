import { QuizScore, QuizSettings } from "@/types";
import type {
  QuizQuestion,
  Question,
  ScoreConfig,
  QuestionState,
  QuizScoreUser,
  UserState,
  QuizQuestionState,
} from "@/types";
import { createMachine, setup, assign, fromPromise } from "xstate";
import { questionMachine, QuestionMachineContext } from "../questions/normal";
import defaultScoreConfig from "@/score-config";
import { getQuizQuestions } from "@/logic";
import { scoreQuestion } from "./actions";

export interface QuizLoadInput {
  quizLength: number;
  questions: Question[];
}
export interface QuizMachineContext {
  score: QuizScore;
  scoreConfig: ScoreConfig;
  settings: QuizSettings;

  incomingQuesions: QuizQuestion[];
  completedQuestions: QuizQuestion[];

  quizLength: number;
  
  activeUser: string;
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
  | (QuizQuestionEvent<"TRY_AGAIN"> & { typedAnswer: string });

export const machine = setup({
  types: {
    context: {} as QuizMachineContext,
    events: {} as QuizEvent,
    input: {} as {
      quizLength: number;
      userId?: string;
      scoreConfig?: ScoreConfig;
    },
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
        typedAnswer: [
          ...(currentQuestion.typedAnswers || []),
          event.typedAnswer,
        ],
      } as QuizQuestion;

      return {
        incomingQuesions: [changedQuestion, ...incomingQuesions],
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
    questionActor: questionMachine,
  },
  guards: {
    isQuizDone: function ({ context }) {
      return context.incomingQuesions.length === 0;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXggdgewCcBbAQwBsA6ASQnTLAGIAZAeQEEARAbQAYBdRKAAOeWOgAu6PDkEgAHogAsATgoAOAExrlAdh4BmNfoBsPZQYA0IAJ6IN+gIwUNDnhuNqArGrMaennQBfQKs0LFxCUkoyPBJaHCgGCGkwCnQcADc8AGtUmLiAOUjyAEUMTF4BJBARMUlpWQUEfXMKfUV9HXbjHUVPA2UrWwRXYwoeCZ4HTw1+nQcHNWDQ8ojicgoSAGNJDNSyuHqcdMSAYRYAJQuAUVOAFUrZWokpGWqmjS7nKa1tRxNTIohogALQODRtDSKNR6Bw6LqeaHGZYgMLYfDrSjbXb7VCHV4nBhUArnK63B78J6iF4Nd6IOFqCjzHjGOEBBzGPqKYzAhCeUxMtTTZT6FnKTnIkKo1YYqKbHboPYUA6wI6EgrXAAaFKqwmpR0aiB4vJ4KLRazl2MVuPx0nVWoeDl1NX1r0NCGNNkQakZ-Qm0OULmMos6wSl+AgcFk5tl5CpdTddIQYP8bUUGmUrn0hh0XksXuTix0kOh-OUma6rk8ZplxUoNDoYHjNLeoCa3PUWnFukMDhFOkGBYzThcbg83l8-iCUpjdYo+XiUGbBqTIICaeHBhzef0vPBTmZ9g5OlmiJ6NfCsaxCr2y8TbdB0N5IPLnehigH4OMpjMF-Rc6tJUVTVBI71pB8PV5cU-wtDYADN0nQWAAAtIDA1t5HpLQeHGNRjChPofE8ENeWhfQ2h4IwdE8BZFEWLQw0CIA */
  context: ({ input }) => ({
    score: {},
    incomingQuesions: [],
    completedQuestions: [],
    currentQuestionIndex: 0,
    settings: {
      timerLength: 60,
    },
    quizLength: input.quizLength,
    scoreConfig: input.scoreConfig ?? defaultScoreConfig,
    activeUser: "",
  }),
  id: "quiz:normal",
  initial: "Idile",
  states: {
    Idile: {
      on: {
        LOAD: "loading",
      },
    },
    loading: {
      invoke: {
        id: "loadNormalQuiz",

        input: ({ context, event }) => {
          const questions =
            "filteredQuestions" in event ? event.filteredQuestions : [];
          return {
            questions: questions,
            quizLength: context.quizLength,
          };
        },

        onDone: {
          target: "active",
          actions: assign(({ event }) => ({
            incomingQuesions: event.output,
            // Explictly define [] to ensure that it is empty
            completedQuestions: [],
          })),
        },

        src: "loadingQuizActor",
      },
    },

    active: {
      initial: "Questioning",
      states: {
        Questioning: {
          invoke: {
            id: "questionNormalQuiz",

            input: ({ context: ctx }) => {
              const [ currentQuestion ] = ctx.incomingQuesions;
              return {
                question: {
                  head: currentQuestion.head,
                  body: currentQuestion.body,
                },
                isQuestionTimed: ctx.settings.timerLength !== 0,
                timerLength: ctx.settings.timerLength,
              } as QuestionMachineContext;
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

                target: "#quiz:normal.finished",
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

    finished: {
      type: "final",
    },
  },
});
