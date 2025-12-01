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
  surveyID: string;
  question?: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface MultipleChoiceContainerProps {
  surveyID: string;
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
  surveyID?: string;
  question: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface RankListItemProps {
  response: OptionType;
  index: number;
}

export interface InputResponseProps {
  surveyID?: string;
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
  surveyID: string;
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
  surveyID: string;
  question: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
  setCanProceed?: (val: boolean) => void;
}

export interface RankListProps {
  surveyID: string;
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
  surveyID: string;
  options: OptionType[];
  multiSelect?: boolean;
  question?: Question;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}

export interface HydrateOptions<T> {
  question: { questionID: string };
  mapPersisted?: (persisted: any) => T;    
  defaultValue?: T;                       
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
  surveyID: string;
  url: string;
  question: Question;
  showQuestion?: boolean;
  setCurrentQuestionIndex?: (index: (prevIndex: number) => number) => void;
}


export type RecordConsentPayload = {
  surveyID?: string;
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
  surveyID?: string;
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
  surveyID?: string;
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

export type PersistedResponseMap = Record<
  string,
  {
    value: any;        
    optionID: string | null;  
  }
>;

export type  ResponseRegistry = {
  isResponse: (qid: string) => boolean;
  setResponse: (qid: string, v: boolean) => void;
  persistedResponses: PersistedResponseMap;
};

export interface ResponseRegistryProviderProps {
  children: React.ReactNode;
  initial?: Record<string, boolean>;    
  persistedResponses?: Array<{
    relatedQuestionID: string;
    response: any;
    relatedOptionID: string | null;
  }>;                                  
}

export type SubmitResponseSkippedPayload = {
  surveyID: string;
  questionID: string;
  questionType: string;
  deviceID: string;
  skipped: boolean;
  behavior?: unknown;
}