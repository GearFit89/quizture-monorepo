export interface Question {
  id: number;
  flight: 'A' | 'B' | 'C' | 'T';
  book: string;
  chapter: string;
  verse?: string;
  ref: string;
  month: string;
  type: string;
  answer?: string;
  question?: string;
  trigs: Record<string, number[]>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  signedIn: boolean;
  xp: number;
  createdAt: string;
}

export interface QuizSession {
  roomId: string;
  userId: string;
  status: 'pending' | 'active' | 'done';
  questions: Question[];
  currentQuestionIndex: number;
  answers: { questionId: number; answer: string; score: number }[];
  totalScore: number;
  createdAt: number;
}

export interface QuizSettings {
  mode: 'practice' | 'quiz' | 'challenge' | 'tournament';
  numQuestions: number;
  lenOfTimer: number;
  verseSelection: 'random' | 'sequential' | 'alphabetical';
  flight: string[];
  type: string[];
  month?: string[];
}
