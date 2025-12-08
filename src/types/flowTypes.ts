import type { Question, QuestionType } from "./questionTypes";

export interface FlowCondition {
  flowConditionID: string;
  relatedSurveyID: string;
  relatedQuestionID: string;
  goto_questionID: string | null;
  conditionType: string;
  conditionValue: string | string[] | null;
}

export interface SurveyPayload {
  surveyID?: string;
  shareID?: string;
  questions: Question[];
  FlowCondition: FlowCondition[];
}

export type AnswerPrimitive = string | number | string[] | boolean | number[] | null;

export type AnswerValue = string | number | boolean | string[] | number[] | null;

export type RuleValue = string | number | boolean | (string | number | boolean)[];

export interface FlowEvaluators {
  [questionType: string]: {
    [operator: string]: (answer: AnswerPrimitive, ruleValue: any) => boolean;
  };
}

export interface FlowRuntimeState {
  flowEligible: Question[];
  indexByQuestionID: Record<string, number>;
  conditionsByQuestionID: Record<string, FlowCondition[]>;
  displayIndexMap: Record<string, number>;
  displayCounter: number;
  visitedStack: string[];
  currentQuestionID: string;
  endScreenQuestionID: string | null;
  lastQuestionID: string | null;
  navAll: Question[];
  navIndexById: Record<string, number>;
  history: string[];
  cursor: number;
}

export interface UseFlowControllerApi {
  currentQuestion: Question;
  currentQuestionID: string;
  currentDisplayIndex: number | null;
  onSubmitAnswer: (answer: AnswerPrimitive) => void;
  onPrev: () => void;
  goNext: () => void;
  registerBeforeNext: (fn: () => void) => void;
  getDisplayIndex: (qid: string) => number | null;
  canGoPrev: boolean;
  isTerminal: boolean;
  visitedStack: string[];
  flowEligible: Question[];
  isLastQuestion: boolean;
}

export interface NextDecision {
  nextQuestionID: string | null;
}

export const NON_ORDERED_TYPES = new Set([
  "WELCOME_SCREEN",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
  "CONSENT",
  "END_SCREEN",
]);

export const NON_FLOW_TYPES = new Set([
  "WELCOME_SCREEN",
  "CONSENT",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
  // "END_SCREEN",
]);

export const END_SCREEN_TYPE: string = "END_SCREEN";

export const isQuestionScreen = (t: QuestionType) => !NON_ORDERED_TYPES.has(t);

export interface ScrollNavProps {
  container: React.RefObject<HTMLElement | null>;
  goNext: () => void;
  goPrev: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isEnd: boolean;
  cooldownMs?: number;
  wheelThreshold?: number;
  touchThreshold?: number;
   onNavigate?: (dir: "next" | "prev") => void;
}

export interface SwipeNavProps {
  container: React.RefObject<HTMLElement | null>;
  goNext: () => void;
  goPrev: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isEnd: boolean;
  cooldownMs?: number; // minimum ms between navigations
  swipeThreshold?: number; // min px horizontal distance
  dirBias?: number; // require |dx| >= dirBias * |dy|
  mobileQuery?: string; // media query to decide "mobile"
}
