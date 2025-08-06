import type { OptionType } from "./option";


export interface InputErrorProps {
  error?: string | null;
  className?: string;
}


export type QuestionTypeKey =
  | "BINARY"
  | "CONSENT"
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
  question?: Question;
  setCurrentQuestionIndex?: React.Dispatch<React.SetStateAction<number>>;
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
  questionPreferences: QuestionPreferences;
  required: boolean;
}

export interface QuestionPreferences {
  preferencesID: string;
  relatedQuestionID: string;
  titleFontSize: number;
  titleFontSizeMobile: number;
  titleFontColor: string;
  descriptionFontSize: number;
  descriptionFontSizeMobile: number;
  descriptionFontColor: string;
  questionImageTemplate: boolean;
  questionImageTemplateUrl: string;
  questionImageTemplatePublicId: string;
  questionBackgroundColor: string;
  required: boolean;
  uiConfig: Record<string, any>;
}

export interface QuestionType {
  questionID?: string;
  type: string;
  order?: number;
  Screen?: React.ComponentType<QuestionProps>;
}

 

export interface QuestionTextandDescriptionProps {
  surveyID?: string;
  question?: Question;
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
