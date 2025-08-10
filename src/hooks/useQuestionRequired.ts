import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { Question } from "@/types/question";
import { useEffect } from "react";

export const useQuestionRequired = (question?: Question) => {
  const { setCanProceed } = useSurveyFlow();
  const isRequired = !!question?.questionPreferences?.required;

  useEffect(() => {
    setCanProceed(!isRequired);
  }, [isRequired, setCanProceed]);

  return isRequired;
};
