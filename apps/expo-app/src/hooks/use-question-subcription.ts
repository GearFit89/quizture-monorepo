import { observable } from '@legendapp/state';
import { useQuizActor } from './quiz-actor.hook'; // FIXME make theses imports smaller
import type { SnapshotFrom, Subscription } from 'xstate';
import type { QuestionActorRef, QuizActorRef } from '@bq/shared/types';
import { useEffect } from 'react';
import { QuestionEvents } from '@bq/shared/machines/questions/setup'; // FIXME make theses imports smaller
import { QuizEvent } from '@bq/shared/machines/quizzes/normal.machine'; // FIXME make theses imports smaller


/** Must be called with `useQuestionSubscription()`, in order for data to be populated. */
export const question$ = observable({
  _questionSubscription: null as Subscription | null,
  _quizActorRef: null as QuizActorRef | null,
  _questionActorRef: null as QuestionActorRef | null,

  quizSnapshot: null as SnapshotFrom<QuizActorRef> | null,
  snapshot: null as SnapshotFrom<QuestionActorRef> | null,

  initialize: (quizActorRef: QuizActorRef) => {
    question$._quizActorRef.set(quizActorRef);
  },

  send: (event: QuestionEvents) =>
    question$._questionActorRef.peek()?.send(event),
  sendToQuiz: (event: QuizEvent) => question$._quizActorRef.peek()?.send(event),

  onQuizEvent: () => {
    const nextQuestionActorRef =
      question$.quizSnapshot.peek()?.context?.questionActorRef;
    const currentQuestionActorRef = question$._questionActorRef.peek();

    if (currentQuestionActorRef !== nextQuestionActorRef) {
      question$._questionSubscription.peek()?.unsubscribe();

      const subscription = nextQuestionActorRef?.subscribe((snapshot) => {
        question$.snapshot.set(snapshot);
      });

      question$._questionSubscription.set(subscription);
      question$._questionActorRef.set(nextQuestionActorRef);
    }
  },
});

export function useQuestionSubscription() {
  const quizActorRef = useQuizActor();

  useEffect(() => {
    question$.initialize(quizActorRef);

    const subscrition = quizActorRef.subscribe((state) => {
      question$.quizSnapshot.set(state);
      question$.onQuizEvent();
    });

    return () => {
      subscrition.unsubscribe();
    };
  }, [quizActorRef]);
}
