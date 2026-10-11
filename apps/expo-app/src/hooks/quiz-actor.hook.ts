

import { useContext } from "react";
import { QuizActorContext } from "@/context";

export function useQuizActor() {
  const actorRef = useContext(QuizActorContext);
  if (!actorRef) {
    throw new Error('useQuizActor must be used within a QuizProvider');
  }
  return actorRef;
}