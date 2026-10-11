import { BookRange, QuizMode } from '@bq/shared/types'
import { IconKey } from '../icons'

interface Button {
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
  normal: SetupMode;

}
interface TimedSetupModes extends SetupModes {
  timed: SetupMode;

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
export type ProfileMockContent = typeof import('./content.json').profileMock
export type SettingsMockContent = typeof import('./content.json').settingsMock

export interface Content {
  quiz: typeof import('./content.json').quiz;
  profileMock: ProfileMockContent;
  settingsMock: SettingsMockContent;
  practicePage: PracticeContent;
  setup: SetupContent;

}
