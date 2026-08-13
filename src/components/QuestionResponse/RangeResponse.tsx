import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { RangeResponseProps } from "@/types/responseTypes";
import { useEffect, useState } from "react";
import ProgressiveSlider from "./ProgressiveSlider";
import ScaleCounter from "./ScaleCounter";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useRegisterQuestionSubmit } from "@/context/QuestionNavigationContext";

const RangeResponse = ({ surveyID, question }: RangeResponseProps) => {
  const isMobile = useIsMobile();
  const { minValue, maxValue } = question.questionPreferences?.uiConfig || {};
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const [error, setError] = useState<string | null>(null);

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const {
    value: selectedValue,
    setValue: setSelectedValue,
    hydrated,
    clearHydration,
  } = useHydratedResponse<number>({
    question,
    defaultValue: Math.ceil((minValue + maxValue) / 2),
    mapPersisted: (p) => {
      const fallback = Math.ceil((minValue + maxValue) / 2);
      const parsed = Number(p.value);

      return p.value == null || Number.isNaN(parsed) ? fallback : parsed;
    },
  });

  const hasAnswer = selectedValue !== null && !Number.isNaN(selectedValue);

  const isRequired = useQuestionRequired(question, hasAnswer);

  const handleSliderChange = (value: number) => {
    handleFirstInteraction();
    handleClick();
    markTouched(question.questionID);
    setSelectedValue((prev) => {
      if (prev !== value) {
        handleOptionChange();
        clearHydration();
      }
      return value;
    });

    if (hydrated) clearHydration();
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (isPending) return;

    if (isRequired && (selectedValue === null || Number.isNaN(selectedValue))) {
      setError("Your response is required for this question");
      return;
    }

    if (!question?.questionID || !question?.type) {
      setError("Missing identifiers. Please reload and try again.");
      return;
    }

    if (hydrated) {
      markAnswered(question.questionID);
      onSubmitAnswer(selectedValue);
      return;
    }

    if (!deviceID) return;

    handleFirstInteraction();
    handleClick();
    markAnswered(question.questionID);
    markSubmission();
    markAnsweredEvent();

    const behavior = collectBehaviorData();

    await mutateAsync({
      questionID: question.questionID,
      qType: question.type,
      optionID: null,
      response: selectedValue,
      deviceID,
      behavior,
      surveyID,
    });

    setRealTimeResponse(question.questionID, selectedValue!, null);

    onSubmitAnswer(selectedValue);
  };

  useRegisterQuestionSubmit(true, handleSubmit);

  useEffect(() => {
    if (hydrated && selectedValue != null) {
      markAnswered(question.questionID);
    }
  }, [hydrated, selectedValue, question.questionID, markAnswered]);

  return (
    <div className="w-4/5 p-2 sm:p-3 md:p-4 xl:p-6">
      {isMobile ? (
        <ScaleCounter question={question} value={selectedValue!} setValue={handleSliderChange} />
      ) : (
        <ProgressiveSlider
          question={question}
          value={selectedValue!}
          setValue={handleSliderChange}
        />
      )}
      <div className="mt-4 hidden w-[104%] justify-end pr-6 md:flex">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-[80px] rounded-[24px] bg-[#005BC4] px-4 py-2 font-bold text-white transition hover:bg-[#004a9f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "..." : "Ok"}
        </button>
      </div>
    </div>
  );
};

export default RangeResponse;
