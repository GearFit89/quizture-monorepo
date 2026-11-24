import { describe, expect, it } from "vitest";
import type { AppQuestion, QuizQuestion } from "@bq/shared/types";
import {
  MAX_DISTRACTORS,
  MIN_DISTRACTORS,
  buildBlocks,
  buildRecallItems,
  createQuizQuestions,
  formatContent,
  isRecallCorrect,
  normalizeWord,
  parseRecallCount,
  pickDistractorCount,
  pickDistractors,
  splitWords,
  summarizeResults,
  type RecallResult,
} from "../src/lib/recall/recall";

function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const questions: AppQuestion[] = [
  { id: 1, book: "1 Thess", chapter: "1", verse: "1", type: "question", question: "Who greet the church of the Thessalonians?", answer: "Paul, Silvanus and Timothy" },
  { id: 2, book: "1 Thess", chapter: "1", verse: "1", type: "question", question: "What be to the church of the Thessalonians?", answer: "Grace and peace" },
  { id: 3, book: "1 Thess", chapter: "1", verse: "2", type: "question", question: "In what do we constantly mention you?", answer: "Our prayers" },
];

const quizQuestions: QuizQuestion[] = [
  { id: 3, ansType: "recall", questType: "question", quizIndex: 1 },
  { id: 1, ansType: "recall", questType: "question", quizIndex: 0 },
  { id: 99, ansType: "recall", questType: "question", quizIndex: 2 },
];

describe("recall word helpers", () => {
  it("splits answers into words without surrounding punctuation", () => {
    expect(splitWords("Paul, Silvanus and Timothy.")).toEqual(["Paul", "Silvanus", "and", "Timothy"]);
    expect(splitWords("  God's   love ")).toEqual(["God's", "love"]);
  });

  it("normalizes case and punctuation", () => {
    expect(normalizeWord("Paul,")).toBe("paul");
  });
});

describe("distractors", () => {
  it("picks between 4 and 6 distractors", () => {
    const random = seeded(7);
    for (let i = 0; i < 50; i++) {
      const count = pickDistractorCount(random);
      expect(count).toBeGreaterThanOrEqual(MIN_DISTRACTORS);
      expect(count).toBeLessThanOrEqual(MAX_DISTRACTORS);
    }
    expect(pickDistractorCount(() => 0.999999)).toBe(MAX_DISTRACTORS);
    expect(pickDistractorCount(() => 0)).toBe(MIN_DISTRACTORS);
  });

  it("uses unique question words that are not in the answer", () => {
    const answer = ["Grace", "and", "peace"];
    const result = pickDistractors(answer, ["Grace and the church and the people"], 6, seeded(3));
    expect(result.map(normalizeWord).sort()).toEqual(["church", "people", "the"]);
  });
});

describe("blocks and checking", () => {
  it("includes every answer word plus distractors", () => {
    const blocks = buildBlocks(["and", "and"], ["x", "y"], seeded(2));
    expect(blocks).toHaveLength(4);
    expect(new Set(blocks.map((b) => b.id)).size).toBe(4);
    expect(blocks.filter((b) => b.isDistractor).map((b) => b.word).sort()).toEqual(["x", "y"]);
  });

  it("checks order and ignores case/punctuation", () => {
    expect(isRecallCorrect(["paul", "Silvanus", "AND", "timothy"], ["Paul", "Silvanus", "and", "Timothy"])).toBe(true);
    expect(isRecallCorrect(["Silvanus", "Paul", "and", "Timothy"], ["Paul", "Silvanus", "and", "Timothy"])).toBe(false);
    expect(isRecallCorrect(["Paul"], ["Paul", "Silvanus"])).toBe(false);
  });
});

describe("buildRecallItems", () => {
  it("resolves QuizQuestions by id in quizIndex order and skips unknown ids", () => {
    const items = buildRecallItems(quizQuestions, questions, seeded(5));
    expect(items.map((i) => i.quizQuestion.id)).toEqual([1, 3]);
    for (const item of items) {
      const distractors = item.blocks.filter((b) => b.isDistractor);
      const answerWords = item.blocks.filter((b) => !b.isDistractor).map((b) => b.word).sort();
      expect(answerWords).toEqual([...item.answerWords].sort());
      expect(distractors.length).toBeGreaterThanOrEqual(MIN_DISTRACTORS);
      expect(distractors.length).toBeLessThanOrEqual(MAX_DISTRACTORS);
      const answerKeys = new Set(item.answerWords.map(normalizeWord));
      distractors.forEach((d) => expect(answerKeys.has(normalizeWord(d.word))).toBe(false));
    }
  });

  it("matches string ids from JSON data", () => {
    const stringIdQuestions = questions.map((q) => ({ ...q, id: String(q.id) as unknown as number }));
    expect(buildRecallItems(quizQuestions, stringIdQuestions, seeded(5))).toHaveLength(2);
  });
});

describe("summary and quiz creation", () => {
  it("summarizes results", () => {
    const results = [{ correct: true }, { correct: false }, { correct: true }] as RecallResult[];
    expect(summarizeResults(results)).toEqual({ total: 3, correct: 2, incorrect: 1, percent: 67 });
    expect(summarizeResults([]).percent).toBe(0);
  });

  it("creates indexed QuizQuestions", () => {
    const created = createQuizQuestions(questions, 2, seeded(9));
    expect(created).toHaveLength(2);
    expect(created.map((q) => q.quizIndex)).toEqual([0, 1]);
    expect(created.every((q) => q.ansType === "recall")).toBe(true);
  });

  it("parses recall counts and falls back for invalid values", () => {
    expect(parseRecallCount("5", 10)).toBe(5);
    expect(parseRecallCount(undefined, 10)).toBe(10);
    expect(parseRecallCount("-1", 10)).toBe(10);
    expect(parseRecallCount("0", 10)).toBe(10);
    expect(parseRecallCount("0.5", 10)).toBe(10);
    expect(parseRecallCount("abc", 10)).toBe(10);
  });

  it("formats content templates", () => {
    expect(formatContent("Question {current} of {total}", { current: 2, total: 5 })).toBe("Question 2 of 5");
  });
});
