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
  surveyID: string;
}

export type FlowContextType = {
  canProceed: boolean;
  setCanProceed: (val: boolean) => void;
};

export interface SurveyNavigatorCompactProps {
  disableNext: boolean;
  navPulse?: "next" | "prev" | null;
}
