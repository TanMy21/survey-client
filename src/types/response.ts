import type { OptionType } from "./option";

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
