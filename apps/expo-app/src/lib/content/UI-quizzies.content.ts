import { Button } from '@/components/ui/button'
import type { IconKey } from '../icons'
import type { QuizKey, QuizMode } from '@bq/shared/types'

export interface UIQuiz {
  id: QuizKey;
  title: string;
  description?: string;
  icon: IconKey;
  shortDescription?: string;

}

export const UI_QUIZZES: Record<QuizMode, UIQuiz []> = {
  SOLO: [
    {
      id: 'SOLO-1',
      title: 'Solo Quiz',
      description: 'Test your knowledge with a solo quiz.',
      icon: 'quiz',
      shortDescription: 'Challenge yourself with a solo quiz.',

    },
    {
      id: 'SOLO-2',
      title: 'Bible Basics',
      description: 'Core facts and passages for beginners.',
      icon: 'bible',
      shortDescription: 'Basic Bible knowledge and facts.',

    },
    {
      id: 'SOLO-3',
      title: 'Speed Round',
      description: 'Quick fire questions against the clock.',
      icon: 'timer',
      shortDescription: 'Answer as many as you can quickly.',

    },
    {
      id: 'SOLO-4',
      title: 'Memory Verses',
      description: 'Match verses to references and memory aids.',
      icon: 'bookmark',
      shortDescription: 'Practice and recall memory verses.',

    },
  ],
  VS: [
    {
      id: 'VS-1',
      title: 'VS Quiz',
      description: 'Compete against a friend in a vs quiz. ',
      icon: 'quiz',
      shortDescription: 'Challenge a friend in a vs quiz.',

    },
    {
      id: 'VS-2',
      title: 'Duel',
      description: 'One-on-one head-to-head quiz.',
      icon: 'quiz',
      shortDescription: 'Face a single opponent in a duel.',

    },
    {
      id: 'VS-3',
      title: 'Team Match',
      description: 'Form teams and compete for points.',
      icon: 'profile',
      shortDescription: 'Play as teams and rack up points.',

    },
  ],

}
