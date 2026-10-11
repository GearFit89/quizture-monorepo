import { Question, QuizQuestion } from "../types";
import { processQuestion, processQuestionType, shuffleArray } from "../utils";

export async function getQuizQuestions(
  filteredQuestions: Question[],
  quizLength: number,
): Promise<QuizQuestion[]> {
  const randomQuestions = shuffleArray(filteredQuestions);

  const questionsPool = randomQuestions.slice(0, quizLength);
  const quesitons: QuizQuestion[] = [];
  for (const question of questionsPool) {
    const processed = await processQuestionType(question);
    quesitons.push({
      body: processed.body,
      head: processed.head,
      answer: processed.answer ?? (question.answer as string),
      id: question.id
    });
  }
  return quesitons;
}
