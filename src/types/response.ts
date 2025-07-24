import type { OptionType } from "./option";
import type { Question } from "./question";

export interface ResponseData {
  surveyID?: string;
  questionID: string;
  qType: string | null;
  optionID: string | null;
  response: string | number | number[] | null;
  participantID?: string | null;
}

export interface ResponseListProps {
  options: OptionType[];
  qType?: string;
}

export interface ResponseListItemProps {
  qType: string;
  response: OptionType;
  index: number;
}

export interface InputResponseProps {
  inputPlaceholder: string;
  submitButtonText: string;
}

export interface BinaryResponseProps {
  questionID: string;
  responseOptionText: string;
  index: number;
}

export interface BinaryResponseContainerProps {
  question: Question;
}
