import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { Question } from "@/types/questionTypes";
import { useEffect } from "react";

export const useQuestionRequired = (question?: Question) => {
  const { setCanProceed } = useSurveyFlow();
  const isRequired = !!question?.required;
  useEffect(() => {
    setCanProceed(!isRequired);
  }, [isRequired, setCanProceed]);

  return isRequired;
};
