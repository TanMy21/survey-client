import type { OptionType } from "./optionTypes";
import type { Question } from "./questionTypes";

export interface ResponseData {
  surveyID?: string;
  deviceID: string;
  questionID: string;
  qType: string | null;
  optionID: string | null;
  response: string | string[] | number | number[] | null | Record<string, unknown>              
          | Array<Record<string, unknown>>  ;
  participantID?: string | null;
  behavior?: any;
  skipped?: boolean;
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

export interface MultipleChoiceContainerProps {
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

export interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export interface HoverImagePreviewProps {
  src: string;
  alt?: string;
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


export type RecordConsentPayload = {
  deviceID: string;              
  consentGiven: boolean;             
  consentTimestamp?: string;    
};

export type RecordConsentResponse = {
  deviceID: string;
  consentGiven: boolean;
  consentTimestamp: string | null;      
};

export type EmailResponsePayload = {
  deviceID: string;          
  questionID: string;          
  email: string;   
  behavior?: any;     
 };

export type EmailResponseResult = {
  id: string;
  questionId: string;
  storedAt: string;            
};

type Register =
  | ((fn: () => void | Promise<void>) => void)
  | ((fn: () => void | Promise<void>) => () => void);

export type BehaviorArgs = {
  registerBeforeNext:Register;
  collectBehaviorData: () => unknown;
  questionID: string;
  deviceID: string;
};


export type SubmitResponsePayload = {
  questionID: string;            
  qType: string; 
  value: unknown;               
  deviceID?: string;            
  behavior?: unknown;           
};

export type  ResponseRegistry = {
  isResponse: (qid: string) => boolean;
  setResponse: (qid: string, v: boolean) => void;
};

export type ResponseRegistryProviderProps = React.PropsWithChildren<{   
  initial?: Record<string, boolean>;
}>;

export type SubmitResponseSkippedPayload = {
  questionID: string;
  questionType: string;
  deviceID: string;
  skipped: boolean;
  behavior?: unknown;
}