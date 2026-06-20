export interface SurveyNavigatorProps {
  currentIndex: number;
  total: number;
  disableNext?: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export interface ISurvey {
  surveyID: string;
  creatorId: string;
  email: string;
  // organization
  title: string;
  description: string;
  sharedLink: string;
  status: string;
  startDate: string;
  endDate: string;
  visibility: string;
  responseLimit: number;
  welcomeScreen: boolean;
  endScreen: boolean;
  // surveyTag
  language: string;
  isTemplate: boolean;
}

export interface SurveyContainerProps {
  surveyID?: string;
  shareID?: string;
  completionTimeEstimate?: CompletionTimeEstimate;
}

export type FlowContextType = {
  canProceed: boolean;
  setCanProceed: (val: boolean) => void;
};

export interface SurveyNavigatorCompactProps {
  disableNext: boolean;
  navPulse?: "next" | "prev" | null;
  shareID?: string;
}

export type SurveyFetchError = Error & {
  status?: number;
  code?: string;
};

export type SurveyUnavailableVariant =
  | "not-found"
  | "expired"
  | "not-started"
  | "unavailable"
  | "error"
  | "locked";

export type SurveyUnavailableScreenProps = {
  variant: SurveyUnavailableVariant;
};


 
export type CompletionTimeEstimate = {
  estimatedCompletionTimeSeconds: number;
  estimatedCompletionTimeMinutes: number;
  source: "OBSERVED_AVERAGE" | "QUESTION_COUNT_FALLBACK";
  answerableQuestionCount: number;
  participantCount: number;
  observedCompletedSessionCount: number;
};