import type { OptionType } from "./option";

export type QuestionTypeKey =
  | "BINARY"
  | "EMAIL_CONTACT"
  | "END_SCREEN"
  | "INSTRUCTIONS"
  | "MEDIA"
  | "NUMBER"
  | "RADIO"
  | "RANK"
  | "RANGE"
  | "TEXT"
  | "MULTIPLE_CHOICE"
  | "WELCOME_SCREEN";

export interface QuestionProps {
  surveyID?: string;
  qOptions?: OptionType[];
  question: Question;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface Question {
  questionID: string;
  relatedSurveyId: string;
  creatorId: string;
  text: string;
  description?: string;
  type: QuestionTypeKey;
  order?: number;
  minOptions: number;
  maxOptions: number;
  options: OptionType[];
  required: boolean;
}

export interface QuestionType {
  questionID?: string;
  type: string;
  order?: number;
  Screen?: React.ComponentType<QuestionProps>;
}

export interface MultipleChoiceFormData {
  selectedChoices: {
    [key: string]: boolean;
  };
}

export interface SlideMotionProps {
  children: React.ReactNode;
  direction: "left" | "right";
  keyProp: string | number;
}
