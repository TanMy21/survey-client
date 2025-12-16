import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useQuestionRequired } from "./useQuestionRequired";
import { useDeviceId } from "./useDeviceID";
import { useSubmitResponseSkipped } from "./useSurvey";
import { useBehavior } from "@/context/BehaviorTrackerContext";
import { SKIPPABLE_TYPES, UUID_RE } from "@/utils/questionConfig";
import { useEffect, useMemo } from "react";

export function useSkipOnAdvance(surveyID: string) {
  const { registerBeforeNext, currentQuestion, currentQuestionID } = useFlowRuntime();
  const { markSkipped, getState } = useResponseRegistry();
  const { collectBehaviorData } = useBehavior();
  const deviceID = useDeviceId();
  const isRequired = useQuestionRequired(currentQuestion);
  const { mutateAsync: postSkip } = useSubmitResponseSkipped();

  // Decide for each type  to attach interceptor or not
  const shouldAttach = useMemo(() => {
    if (!currentQuestion) return false;
    if (!SKIPPABLE_TYPES.has(currentQuestion.type)) return false;
    if (!UUID_RE.test(currentQuestionID)) return false; // ignore injected screen like consent
    if (isRequired) return false; // if question is required
    if (!deviceID) return false;
    return true;
  }, [currentQuestion, currentQuestionID, isRequired, deviceID]);

  useEffect(() => {
    if (!shouldAttach) return;

    const unregister = registerBeforeNext(async () => {
      // If answered, don't send skip
      // if (isResponse(currentQuestionID)) return;

      const state = getState(currentQuestionID);

      if (state !== "UNTOUCHED") return;

      await postSkip({
        deviceID,
        questionID: currentQuestionID,
        questionType: currentQuestion.type,
        surveyID,
        skipped: true,
        behavior: collectBehaviorData(),
      });

      // setResponse(currentQuestionID, false);
      markSkipped(currentQuestionID);
    });

    return unregister;
  }, [
    shouldAttach,
    registerBeforeNext,
    getState,
    markSkipped,
    postSkip,
    deviceID,
    surveyID,
    currentQuestionID,
    collectBehaviorData,
    currentQuestion,
  ]);
}
