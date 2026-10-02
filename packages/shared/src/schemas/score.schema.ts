import * as v from "valibot";


export const QuizOutSchema = v.union([
  v.literal("perfect"),
  v.literal("imperfect"),
  v.literal("error"),
]);

export const QuestionStateSchema = v.union([
  v.literal("correct"),
  v.literal("incorrect"),
]);

// ScoreOption Schema
export const ScoreOptionSchema = v.object({
  points: v.number(),
  label: v.string(),
});


// QuizOutOption Schema
export const QuizOutOptionSchema = v.object({
  ...ScoreOptionSchema.entries,
  canDoBonus: v.optional(v.boolean()),
  threshold: v.record(QuestionStateSchema, v.number()),
});

// ScoreConfig Schema
export const ScoreConfigSchema = v.object({
  id: v.string(),

  global: v.optional(
    v.object({
      mutliplier: v.optional(v.number()),
      offset: v.optional(v.number()),
    }),
  ),

  quizOut: v.record(QuizOutSchema, QuizOutOptionSchema),

  question: v.record(QuestionStateSchema, ScoreOptionSchema),

  bonus: v.record(QuestionStateSchema, ScoreOptionSchema),
});