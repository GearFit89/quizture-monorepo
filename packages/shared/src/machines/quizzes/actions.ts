
import type {
  QuizQuestion,
  Question,
  ScoreConfig,
  QuestionState,
  QuizScoreUser,
  UserState,
} from "@/types";
import type { QuizMachineContext } from "./normal.machine";


const defaultUserScore: QuizScoreUser = {
  points: 0,
  correct: 0,
  incorrect: 0,
  state: "active",
};

export function scoreQuestion(
  questionState: QuestionState,
  context: QuizMachineContext,
  activeUser: string,
): QuizScoreUser {
  const { scoreConfig, score } = context;

  const activeUserScore = score[activeUser] ?? defaultUserScore;
  const { points, correct, incorrect, state } = activeUserScore;

  let pointsToAdd = scoreConfig.question[questionState].points;
  let userState: UserState = state;

  const userCorrect = questionState === "correct" ? correct + 1 : correct;
  const userIncorrect =
    questionState === "incorrect" ? incorrect + 1 : incorrect;

  const quizOut = scoreConfig.quizOuts.find(({ threshold }) => {
    const matchesCorrectThreshold = threshold.correct
      ? threshold.correct === userCorrect
      : true;
    const matchesIncorrectThreshold = threshold.incorrect
      ? threshold.incorrect === userIncorrect
      : true;
    return matchesCorrectThreshold && matchesIncorrectThreshold;
  });

  if (quizOut) {
    pointsToAdd += quizOut.points;
    userState = "out";
  }

  return {
    points: points + pointsToAdd,
    correct: userCorrect,
    incorrect: userIncorrect,
    state: userState,
  };
}