import { BIBLE_BOOKS } from "../utils";


export interface RefObject {
  book: string;
  chapter: string;
  verse: string;
  verseRange?: string
}
 export type BibleKey = keyof typeof BIBLE_BOOKS


export interface AppFilterCriteria {
  month: string [];
  flight: string[];
  bookRange: BookRange;
  difficulty?: string[]
  type: string []


}


export type FilterCriteria<T = BaseQuestion> = {
  [K in keyof T]?: Array<NonNullable<T[K]>> | null;
} & {
  bookRange: BookRange;
};
export type BookRange = Partial<Record<BibleKey, string[]>>

export interface BaseQuestion {
  id: number;
  book: string;
  chapter: string;
  verse: string;
  type: string;

  verseRange?: string;

}
export interface AppQuestion extends BaseQuestion{
  flight?:string;
  month?: string;

  question?: string;
  answer?: string;

   difficulty?: number
}

export interface VerseQuestion extends AppQuestion {
  ref?: string; // Bible refence (book chapter:verse)
  type: "ftv"|"quote"
  numVerse?: number;
 


}
export interface FTVQuestion extends VerseQuestion{
  type: "ftv",
  stopAtWord: number; // The word at which the question stops

}

export interface QuoteQuestion extends VerseQuestion {
  type: "quote";
  includeRef?: boolean;
  strictLevel?: number;

}
export interface NormalQuestion extends AppQuestion {
  answer: string;
  question: string;
  type: "question";


}

export type Question = NormalQuestion | FTVQuestion | QuoteQuestion

export type QuizQuestionState = "none"|"correct"|"incorrect"|"skipped"
export interface QuizQuestion  {
  state?: QuizQuestionState;
  body: string
  head: string;
  answer: string;
  id: number; // This is the id for the actual question
  owner?: string // The user who answered
  typedAnswers?: string[];

}
