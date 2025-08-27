import type { Question } from "@/types/questionTypes";
import { EVALUATORS } from "./ConditionEvaluators";
import {
  END_SCREEN_TYPE,
  NON_FLOW_TYPES,
  type AnswerPrimitive,
  type FlowCondition,
  type FlowRuntimeState,
} from "@/types/flowTypes";

export const sortByOrder = (xs: Question[]) =>
  [...xs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function naturalNextAll(state: FlowRuntimeState, fromID: string): string | null {
  const idx = state.navIndexById[fromID]; // use full list index
  if (idx == null) return null;
  const next = state.navAll[idx + 1]; // step through the full list
  return next ? next.questionID : null;
}

export function buildFlowEligible(all: Question[]): Question[] {
  return [...all]
    .filter((q) => !NON_FLOW_TYPES.has(q.type) || q.type === END_SCREEN_TYPE)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function indexByQuestionID(nodes: Question[]): Record<string, number> {
  const m: Record<string, number> = {};
  nodes.forEach((q, i) => {
    m[q.questionID] = i;
  });
  return m;
}

export const isOrderable = (qid: string, s: FlowRuntimeState) => {
  const idx = s.navIndexById[qid];
  if (idx == null) return false;
  return !NON_FLOW_TYPES.has(s.navAll[idx].type);
};

export function groupConditionsByQuestionID(
  rules: FlowCondition[]
): Record<string, FlowCondition[]> {
  const m: Record<string, FlowCondition[]> = {};
  for (const r of rules) {
    if (!m[r.relatedQuestionID]) m[r.relatedQuestionID] = [];
    m[r.relatedQuestionID].push(r);
  }
  return m;
}

export function findEndScreenQuestionID(nodes: Question[]): string | null {
  const end = nodes.find((q) => q.type === END_SCREEN_TYPE);
  return end ? end.questionID : null;
}

export function findLastQuestionID(nodes: Question[]): string | null {
  const onlyQuestionTypes = nodes.filter((q) => q.type !== END_SCREEN_TYPE);
  if (onlyQuestionTypes.length === 0) return null;
  return onlyQuestionTypes[onlyQuestionTypes.length - 1].questionID;
}

export function terminalTargetQuestionID(state: FlowRuntimeState): string | null {
  return state.endScreenQuestionID ?? state.lastQuestionID ?? null;
}

export function naturalNextQuestionID(
  state: FlowRuntimeState,
  currentQuestionID: string
): string | null {
  const idx = state.indexByQuestionID[currentQuestionID];
  if (idx === undefined) {
    return terminalTargetQuestionID(state);
  }
  const nextIdx = idx + 1;
  if (nextIdx < state.flowEligible.length) {
    return state.flowEligible[nextIdx].questionID;
  }

  const term = terminalTargetQuestionID(state);
  if (term && term !== currentQuestionID) return term;
  return null;
}

export function evaluateNextQuestionID(
  state: FlowRuntimeState,
  question: Question,
  answer: AnswerPrimitive
): string | null {
  const rules = state.conditionsByQuestionID[question.questionID] ?? [];
  const evaluators = EVALUATORS[question.type] || {};
  for (const rule of rules) {
    const fn = evaluators[rule.conditionType];
    if (typeof fn === "function") {
      const ok = fn(answer, rule.conditionValue);
      if (ok) {
        return rule.goto_questionID ?? terminalTargetQuestionID(state);
      }
    }
  }

  return naturalNextQuestionID(state, question.questionID);
}

export function ensureDisplayNumber(state: FlowRuntimeState, qid: string): void {
  if (state.displayIndexMap[qid] !== undefined) return;

  // find the node in the full nav list (works for any screen)
  const idx = state.navIndexById[qid];
  if (idx == null) return;
  const node = state.navAll[idx];

  // number only "real" questions; exclude NON_FLOW_TYPES and END_SCREEN
  // (END_SCREEN is already in NON_FLOW_TYPES in your setup)
  const shouldNumber = !NON_FLOW_TYPES.has(node.type);
  if (!shouldNumber) return;

  state.displayCounter += 1;
  state.displayIndexMap[qid] = state.displayCounter;
}

export function pushIfNotDuplicate(stack: string[], qid: string): void {
  const last = stack[stack.length - 1];
  if (last !== qid) stack.push(qid);
}

export function pushForward(s: FlowRuntimeState, nextQID: string): FlowRuntimeState {
  // If the very next entry already matches, just advance the cursor.
  if (s.cursor + 1 < s.history.length && s.history[s.cursor + 1] === nextQID) {
    return { ...s, cursor: s.cursor + 1, currentQuestionID: nextQID };
  }
  // Otherwise we’re taking a new path: drop the “future” and append nextQID.
  const newHistory = s.history.slice(0, s.cursor + 1);
  newHistory.push(nextQID);
  return {
    ...s,
    history: newHistory,
    cursor: newHistory.length - 1,
    currentQuestionID: nextQID,
  };
}

export function currentQuestion(state: FlowRuntimeState): Question {
  const idx = state.navIndexById[state.currentQuestionID];
  return state.navAll[idx];
}
