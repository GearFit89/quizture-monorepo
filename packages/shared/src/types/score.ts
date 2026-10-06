import {
  QuizOutOptionSchema,
  QuizOutSchema,
  QuestionStateSchema,
  ScoreConfigSchema,
  ScoreOptionSchema,
} from "@/schemas";
import * as v from "valibot"

export type UserState = "out" | "active"
export interface QuizScoreUser{
    points: number;
    correct: number;
    incorrect: number;
    state: UserState;
    skipped?: number;
}
 export interface QuizScore {
    [username: string]: QuizScoreUser
    
 }

export type QuizOutOption = v.InferOutput<typeof QuizOutOptionSchema>;
export type ScoreOption = v.InferOutput<typeof ScoreOptionSchema>;
export type ScoreConfig = v.InferOutput<typeof ScoreConfigSchema>;
export type QuestionState = v.InferOutput<typeof QuestionStateSchema>;
export type QuizOut = v.InferOutput<typeof QuizOutSchema>;
