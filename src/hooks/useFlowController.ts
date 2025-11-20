import {
  NON_FLOW_TYPES,
  type AnswerPrimitive,
  type FlowRuntimeState,
  type SurveyPayload,
  type UseFlowControllerApi,
} from "@/types/flowTypes";
import {
  buildFlowEligible,
  currentQuestion,
  ensureDisplayNumber,
  evaluateNextQuestionID,
  findEndScreenQuestionID,
  findLastQuestionID,
  groupConditionsByQuestionID,
  indexByQuestionID,
  naturalNextAll,
  naturalNextQuestionID,
  pushForward,
  pushIfNotDuplicate,
  terminalTargetQuestionID,
} from "@/utils/flow/FlowEngine";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useFlowController(payload: SurveyPayload): UseFlowControllerApi {
  const flowEligible = useMemo(() => buildFlowEligible(payload.questions), [payload.questions]);
  const indexMap = useMemo(() => indexByQuestionID(flowEligible), [flowEligible]);
  const consentQuestionID = payload.questions.find(
  q => q.type === "CONSENT"
)?.questionID || null;
  
  
  // B) NEW: full list for free nav (includes everything, ordered by .order)
  const navAll = useMemo(
    () => [...payload.questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [payload.questions]
  );

  const navIndexById = useMemo(() => {
    const m: Record<string, number> = {};
    navAll.forEach((q, i) => {
      m[q.questionID] = i;
    });
    return m;
  }, [navAll]);

  const conditionsByQuestionID = useMemo(
    () => groupConditionsByQuestionID(payload.FlowCondition || []),
    [payload.FlowCondition]
  );

  // compute terminal targets
  const endScreenQuestionID = useMemo(() => findEndScreenQuestionID(flowEligible), [flowEligible]);
  const lastQuestionID = useMemo(() => findLastQuestionID(flowEligible), [flowEligible]);

  // pick initial starting node: first flow-eligible (should be the first question)
  const initialQID = navAll[0]?.questionID ?? "";

  // Single mutable source of truth for runtime (kept in React state)
  const [state, setState] = useState<FlowRuntimeState>(() => ({
    flowEligible,
    indexByQuestionID: indexMap,
    conditionsByQuestionID,
    displayIndexMap: Object.create(null),
    displayCounter: 0,
    history: initialQID ? [initialQID] : [],
    cursor: initialQID ? 0 : -1,
    visitedStack: initialQID ? [initialQID] : [],
    currentQuestionID: initialQID,
    endScreenQuestionID,
    lastQuestionID,
    navAll,
    navIndexById,
  }));

  // Keep state in sync if payload changes (rare during a session)
  // Only do minimal recalculation needed.
  const prevPayloadRef = useRef({
    flowEligible,
    indexMap,
    conditionsByQuestionID,
    endScreenQuestionID,
    lastQuestionID,
    navAll,
    navIndexById,
  });
  if (
    prevPayloadRef.current.flowEligible !== flowEligible ||
    prevPayloadRef.current.indexMap !== indexMap ||
    prevPayloadRef.current.conditionsByQuestionID !== conditionsByQuestionID ||
    prevPayloadRef.current.endScreenQuestionID !== endScreenQuestionID ||
    prevPayloadRef.current.lastQuestionID !== lastQuestionID ||
    prevPayloadRef.current.navAll !== navAll ||
    prevPayloadRef.current.navIndexById !== navIndexById
  ) {
    prevPayloadRef.current = {
      flowEligible,
      indexMap,
      conditionsByQuestionID,
      endScreenQuestionID,
      lastQuestionID,
      navAll,
      navIndexById,
    };
    setState((s) => ({
      ...s,
      flowEligible,
      indexByQuestionID: indexMap,
      conditionsByQuestionID,
      endScreenQuestionID,
      lastQuestionID,
      navAll,
      navIndexById,

      currentQuestionID:
        navIndexById[s.currentQuestionID] !== undefined
          ? s.currentQuestionID
          : (navAll[0]?.questionID ?? ""),
      visitedStack:
        navIndexById[s.currentQuestionID] !== undefined
          ? s.visitedStack
          : navAll[0]?.questionID
            ? [navAll[0].questionID]
            : [],
    }));
  }

  // Ensure display number for the current node
  useEffect(() => {
    if (!state.currentQuestionID) return;
    setState((s) => {
      if (s.displayIndexMap[s.currentQuestionID] !== undefined) return s;
      const clone = { ...s, displayIndexMap: { ...s.displayIndexMap } };
      ensureDisplayNumber(clone, s.currentQuestionID); // has NON_FLOW guard
      return clone;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentQuestionID]);

  // const getDisplayIndex = useCallback(
  //   (qid: string) => state.displayIndexMap[qid] ?? null,
  //   [state.displayIndexMap]
  // );


const isLastQuestion = state.currentQuestionID === state.lastQuestionID;
    const beforeNextRef = useRef<Array<() => Promise<void> | void>>([]);
  const isAdvancingRef = useRef(false);

  const registerBeforeNext = useCallback((fn: () => Promise<void> | void) => {
    beforeNextRef.current.push(fn);
    return () => {
      beforeNextRef.current = beforeNextRef.current.filter(f => f !== fn);
    };
  }, []);



  // CHANGE: add a shared "advanceTo" that ALWAYS runs beforeNext hooks
const advanceTo = useCallback(
  async (computeNextQID: (s: FlowRuntimeState) => string | null) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    try {
      for (const fn of beforeNextRef.current) await fn(); // CHANGE: run interceptors
      setState((s) => {
        const nextQID = computeNextQID(s) ?? s.currentQuestionID;
        if (!nextQID || nextQID === s.currentQuestionID) return s;
        return pushForward(s, nextQID);
      });
    } finally {
      isAdvancingRef.current = false;
    }
  },
  [setState]
);

// CHANGE: make goNext use advanceTo
const goNext = useCallback(() => {
  return advanceTo((s) => {

   const consentNode = s.navAll.find(q => q.type === "CONSENT");
    if (consentNode) {
      const currentNode = s.navAll.find((q) => q.questionID === s.currentQuestionID);

      // COMMENT: Only enforce if both nodes have a defined order.
      if (
        currentNode?.order != null &&
        consentNode.order != null &&
        currentNode.order < consentNode.order // COMMENT: "before consent" in sequence
      ) {
        return consentNode.questionID; // COMMENT: FORCE navigation to consent
      }
    }

    const idx = s.navIndexById[s.currentQuestionID];
    const nextNode = idx != null ? s.navAll[idx + 1] : undefined;
    return nextNode?.questionID ?? terminalTargetQuestionID(s);
  });
}, [advanceTo]);


  // const goNext = useCallback(async() => {

  //   if (isAdvancingRef.current) return;        // prevent double-advance
  //   isAdvancingRef.current = true;
  //  try {
  //     // --- NEW: run pre-hooks (flush behavior, etc.) ---
  //     for (const fn of beforeNextRef.current) {
  //       // each may be sync or async
  //       await fn();
  //     }
  //     // -------------------------------------------------

  //     // your existing state transition
  //     setState((s) => {
  //       const idx = s.navIndexById[s.currentQuestionID];
  //       const nextNode = idx != null ? s.navAll[idx + 1] : undefined;
  //       const nextQID = nextNode?.questionID ?? terminalTargetQuestionID(s) ?? s.currentQuestionID;
  //       if (!nextQID || nextQID === s.currentQuestionID) return s;
  //       return pushForward(s, nextQID);
  //     });
  //   } finally {
  //     isAdvancingRef.current = false;
  //   }
  // }, [setState]);





  const currentQObj = currentQuestion(state);
  const isTerminal =
    terminalTargetQuestionID(state) === state.currentQuestionID ||
    naturalNextQuestionID(state, state.currentQuestionID) === null;

  // const onSubmitAnswer = useCallback(
  //   (answer: AnswerPrimitive) => {
  //     setState((s) => {
  //       const q = s.flowEligible[s.indexByQuestionID[s.currentQuestionID]];
  //       const nextQID = evaluateNextQuestionID(s, q, answer) ?? s.currentQuestionID;
  //       if (!nextQID || nextQID === s.currentQuestionID) return s;
  //       return pushForward(s, nextQID);
  //     });
  //   },
  //   [setState]
  // );

  const onSubmitAnswer = useCallback(
  (answer: AnswerPrimitive) => {
    return advanceTo((s) => {
      const qIdx = s.indexByQuestionID[s.currentQuestionID];
      if (qIdx == null) return null;
      const q = s.flowEligible[qIdx];
      return evaluateNextQuestionID(s, q, answer);  // CHANGE: now array-aware
    });
  },
  [advanceTo]
);



  const onPrev = useCallback(() => {
    setState((s) => {
      if (s.cursor <= 0) return s; // already at start
      const newCursor = s.cursor - 1;
      const prevQID = s.history[newCursor];
      return {
        ...s,
        cursor: newCursor,
        currentQuestionID: prevQID,
      };
    });
  }, [setState]);

  const isOrderable = (qid: string, s: FlowRuntimeState) => {
    const idx = s.navIndexById[qid];
    if (idx == null) return false;
    return !NON_FLOW_TYPES.has(s.navAll[idx].type);
  };

  // Derive the display number from history
  const currentDisplayIndex = useMemo(() => {
    if (state.cursor < 0) return null;
    let count = 0;
    for (let i = 0; i <= state.cursor; i++) {
      if (isOrderable(state.history[i], state)) count++;
    }
    // Cap to max number of orderable questions
    const maxOrderable = state.navAll.filter((q) => !NON_FLOW_TYPES.has(q.type)).length;
    return Math.min(count, maxOrderable);
  }, [state.cursor, state.history, state.navAll]);

  return {
    currentQuestion: currentQObj,
    currentQuestionID: state.currentQuestionID,
    currentDisplayIndex,
    onSubmitAnswer,
    onPrev,
    goNext, registerBeforeNext,
    getDisplayIndex: () => null,
    canGoPrev: state.cursor > 0,
    isTerminal,
    visitedStack: state.history.slice(0, state.cursor + 1),
    flowEligible: state.flowEligible,isLastQuestion,
  };
}
