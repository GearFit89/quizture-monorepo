import type { normalQuestionMachine, normalQuizMachine } from "../machines"
import type {  ActorRefFrom } from "xstate"

export type * as QuestionT from "../machines/questions/normal.machine"
export type * as QuizT from "../machines/quizzes/normal.machine"


export type QuizActorRef = ActorRefFrom<typeof normalQuizMachine>
// TODO: Add more via unions when actors are added
export type QuestionActorRef = ActorRefFrom<typeof normalQuestionMachine>