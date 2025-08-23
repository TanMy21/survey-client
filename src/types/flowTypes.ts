import type { Question } from "./questionTypes";

export interface FlowCondition {
  flowConditionID: string;
  relatedSurveyID: string;
  relatedQuestionID: string;
  goto_questionID: string | null;
  conditionType: string;

  conditionValue: string | string[] | null;
}

export interface SurveyPayload {
  surveyID: string;
  questions: Question[];
  FlowCondition: FlowCondition[];
}

export type AnswerPrimitive = string | number | string[] | null;

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
  lastQuestionQuestionID: string | null;
}

export interface NextDecision {
  nextQuestionID: string | null;
}

export const NON_FLOW_TYPES = new Set([
  "WELCOME_SCREEN",
  "CONSENT",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
]);

export const END_SCREEN_TYPE: string = "END_SCREEN";
