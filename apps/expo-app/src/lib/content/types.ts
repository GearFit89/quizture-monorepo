import { IconKey } from "../icons";


interface Button  {
      title: string;
      description: string;
   };
export interface PracticeContent {
   flashCardButton: Button;
   contentButton: Button;
}

export interface Option {
  label: string;
  value: string;
}

export interface QuizFilterSection {
  title: string;
  subtitle: string;
  verseSelection: {
    title: string;
    options: Option[];
  };
  questionType: {
    title: string;
    options: Option[];
  };
  numQuestions: {
    title: string;
    placeholder: string;
  };
  timer: {
    title: string;
    placeholder: string;
  };
  speed: {
    title: string;
  };
  questionSelection: {
    title: string;
    options: Option[];
  };
  months: {
    title: string;
    options: Option[];
  };
  
  triggerWords: {
    title: string;
    options: Option[];
  };
  flight: {
    title: string;
    options: Option[];
  };
  
}
interface SetupMode {
         icon: IconKey;
         description: string;
         title: string;
}
interface SetupModes {
   "normal": SetupMode;
   
}
interface TimedSetupModes extends SetupModes {
   "timed": SetupMode;


}

export interface SetupContent {
   standard: {
      modes: TimedSetupModes
   },
   filterSection: QuizFilterSection;
   setupButton: string;
   errorInvalidQuestionLength: {
      title: string;
      message: string;
   }

}
export interface RecallContent {
   title: string;
   subtitle: string;
   progress: string;
   questionLabel: string;
   answerLabel: string;
   answerPlaceholder: string;
   wordBankLabel: string;
   clearButton: string;
   submitButton: string;
   nextButton: string;
   finishButton: string;
   correctTitle: string;
   correctMessage: string;
   incorrectTitle: string;
   incorrectMessage: string;
   reviewTitle: string;
   reviewSubtitle: string;
   reviewScore: string;
   reviewPercent: string;
   reviewCorrectLabel: string;
   reviewIncorrectLabel: string;
   reviewYourAnswer: string;
   reviewCorrectAnswer: string;
   reviewNoAnswer: string;
   retryButton: string;
   loading: string;
   errorLoading: string;
   empty: string;
}
export interface Content {
    practicePage: PracticeContent;
    setup: SetupContent;
    recall: RecallContent;
   

}