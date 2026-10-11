import type { QuizActorRef } from '@bq/shared/types/machine';

import { Text } from "@/components/ui/text";
import { useQuizContent } from "@/hooks";
import { useSelector } from "@xstate/react";
import { QuizActorContext } from "@/context";
import { RootActorContext } from "@/context";

interface QuizProviderProps {
  actorId: string;
  children: React.ReactNode;
}

export function QuizProvider({ actorId, children }: QuizProviderProps) {
  const rootActorRef = RootActorContext.useActorRef();

  const quizActorRef = useSelector(
    rootActorRef,
    (state) => state.children[actorId] ?? null,
  );

  const content = useQuizContent();
  const actor = quizActorRef;
  const quizContext = actor?.getSnapshot().context;
  if (!actor || !Array.isArray(quizContext?.incomingQuesions)) return <Text>{content.quizUnavailable}</Text>;

  return (
    <QuizActorContext.Provider value={actor as QuizActorRef}>
      {children}
    </QuizActorContext.Provider>
  );
}
