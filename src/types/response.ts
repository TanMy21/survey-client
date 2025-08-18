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
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface SingleChoiceListProps {
  question?: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface MultipleChoiceListProps extends ResponseListProps {
  selectedOptions: { optionID: string; value: string }[];
  onToggle: (optionID: string, value: string) => void;
  registerOptionRef?: (optionID: string, el: HTMLDivElement | null) => void;
}

export interface ResponseListItemProps {
  response: OptionType;
  index: number;
}

export interface SingleChoiceListItemProps extends ResponseListItemProps {
  selected: boolean;
  onSelect: () => void;
}

export interface MultipleChoiceListItemProps extends ResponseListItemProps {
  checked: boolean;
  onToggle: (optionID: string, value: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface RangeResponseProps {
  question: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface RankListItemProps {
  response: OptionType;
  index: number;
}

export interface InputResponseProps {
  inputPlaceholder: string;
  submitButtonText: string;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
  setCanProceed?: (val: boolean) => void;
  disabled?: boolean;
  question?: Question;
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
  setCanProceed?: (val: boolean) => void;
}

export interface ThreeDResponseContainerProps {
  question: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
  setCanProceed?: (val: boolean) => void;
}

export interface RankListProps {
  options: OptionType[];
  disabled?: boolean;
  question?: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
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
  multiSelect?: boolean;
  question?: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface MediaOptionProps {
  option: OptionType;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface SliderProps extends RangeResponseProps {
  value: number;
  setValue: (val: number) => void;
}

export interface ThreeDViewProps {
  url: string;
  question: Question;
  showQuestion?: boolean;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}
