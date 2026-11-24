import type { AppQuestion, QuizQuestion } from "@bq/shared/types";

export const MIN_DISTRACTORS = 4;
export const MAX_DISTRACTORS = 6;

export type RandomFn = () => number;

export interface RecallBlock {
  id: string;
  word: string;
  isDistractor: boolean;
}

export interface RecallItem {
  quizQuestion: QuizQuestion;
  question: string;
  answer: string;
  answerWords: string[];
  blocks: RecallBlock[];
}

export interface RecallResult {
  item: RecallItem;
  selectedWords: string[];
  correct: boolean;
}

export interface RecallSummary {
  total: number;
  correct: number;
  incorrect: number;
  percent: number;
}

export function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, ""))
    .filter((word) => word.length > 0);
}

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
}

export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickDistractorCount(random: RandomFn = Math.random): number {
  const range = MAX_DISTRACTORS - MIN_DISTRACTORS + 1;
  return MIN_DISTRACTORS + Math.min(range - 1, Math.floor(random() * range));
}

export function pickDistractors(
  answerWords: string[],
  questionTexts: string[],
  count: number,
  random: RandomFn = Math.random,
): string[] {
  const excluded = new Set(answerWords.map(normalizeWord));
  const pool = new Map<string, string>();
  for (const text of questionTexts) {
    for (const word of splitWords(text)) {
      const key = normalizeWord(word);
      if (key && !excluded.has(key) && !pool.has(key)) pool.set(key, word);
    }
  }
  return shuffle([...pool.values()], random).slice(0, count);
}

export function buildBlocks(
  answerWords: string[],
  distractors: string[],
  random: RandomFn = Math.random,
): RecallBlock[] {
  const blocks: RecallBlock[] = [
    ...answerWords.map((word, i) => ({ id: `a-${i}`, word, isDistractor: false })),
    ...distractors.map((word, i) => ({ id: `d-${i}`, word, isDistractor: true })),
  ];
  return shuffle(blocks, random);
}

export function isRecallCorrect(selectedWords: string[], answerWords: string[]): boolean {
  if (selectedWords.length !== answerWords.length) return false;
  return selectedWords.every(
    (word, i) => normalizeWord(word) === normalizeWord(answerWords[i]),
  );
}

export function findQuestion<T extends Pick<AppQuestion, "id">>(
  questions: T[],
  id: QuizQuestion["id"],
): T | undefined {
  return questions.find((question) => String(question.id) === String(id));
}

export function buildRecallItems(
  quizQuestions: QuizQuestion[],
  questions: AppQuestion[],
  random: RandomFn = Math.random,
): RecallItem[] {
  const resolved = [...quizQuestions]
    .sort((a, b) => a.quizIndex - b.quizIndex)
    .map((quizQuestion) => ({ quizQuestion, data: findQuestion(questions, quizQuestion.id) }))
    .filter(
      (entry): entry is { quizQuestion: QuizQuestion; data: AppQuestion & { question: string; answer: string } } =>
        Boolean(entry.data?.question && entry.data?.answer),
    );

  const questionTexts = resolved.map((entry) => entry.data.question);

  return resolved.map(({ quizQuestion, data }) => {
    const answerWords = splitWords(data.answer);
    const distractors = pickDistractors(
      answerWords,
      questionTexts,
      pickDistractorCount(random),
      random,
    );
    return {
      quizQuestion,
      question: data.question,
      answer: data.answer,
      answerWords,
      blocks: buildBlocks(answerWords, distractors, random),
    };
  });
}

export function summarizeResults(results: RecallResult[]): RecallSummary {
  const total = results.length;
  const correct = results.filter((result) => result.correct).length;
  return {
    total,
    correct,
    incorrect: total - correct,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export function parseRecallCount(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function createQuizQuestions(
  questions: Pick<AppQuestion, "id" | "type">[],
  count: number,
  random: RandomFn = Math.random,
): QuizQuestion[] {
  return shuffle(questions, random)
    .slice(0, count)
    .map((question, quizIndex) => ({
      id: question.id,
      ansType: "recall",
      questType: question.type,
      quizIndex,
    }));
}

export function formatContent(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}
