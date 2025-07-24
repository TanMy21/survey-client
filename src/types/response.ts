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

export interface RangeResponseProps {
  question: Question;
}

export interface RankListItemProps {
  response: OptionType;
  index: number;
}

export interface InputResponseProps {
  inputPlaceholder: string;
  submitButtonText: string;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface BinaryResponseProps {
  questionID: string;
  responseOptionText: string;
  index?: number;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export interface BinaryResponseContainerProps {
  question: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface RankListProps {
  options: OptionType[];
}

export interface Mark {
  value: number;
  label?: string;
}

export interface StaticSliderConfig {
  tick: {
    minSize: number;
    increment: number;
  };
  segment: {
    minThickness: number;
    increment: number;
  };
  gap: number;
}

export interface MediaOptionsProps {
  options: OptionType[];
}

export interface MediaOptionProps {
  option: OptionType;
}
