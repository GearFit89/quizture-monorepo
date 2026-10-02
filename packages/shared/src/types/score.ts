import {
  QuizOutOptionSchema,
  QuizOutSchema,
  QuestionStateSchema,
  ScoreConfigSchema,
  ScoreOptionSchema,
} from "@/schemas";
import * as v from "valibot"


export type QuizOutOption = v.InferOutput<typeof QuizOutOptionSchema>;
export type ScoreOption = v.InferOutput<typeof ScoreOptionSchema>;
export type ScoreConfig = v.InferOutput<typeof ScoreConfigSchema>;
export type QuestionState = v.InferOutput<typeof QuestionStateSchema>;
export type QuizOut = v.InferOutput<typeof QuizOutSchema>;
