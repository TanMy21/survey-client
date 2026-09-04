import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { RangeResponseProps } from "@/types/responseTypes";
import { useCallback, useEffect, useState } from "react";
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
  const isMobileDevice = useIsMobileDevice();
  const { minValue, maxValue } = question.questionPreferences?.uiConfig || {};
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const [error, setError] = useState<string | null>(null);
  const [autoSubmitArmed, setAutoSubmitArmed] = useState(false);

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

  const handleSliderChange = useCallback(
    (value: number) => {
      if (isPending) return;

      handleFirstInteraction();
      handleClick();
      markTouched(question.questionID);
      setAutoSubmitArmed(!isMobileDevice);
      setSelectedValue((prev) => {
        if (prev !== value) {
          handleOptionChange();
          clearHydration();
        }
        return value;
      });

      if (hydrated) clearHydration();
      if (error) setError(null);
    },
    [
      clearHydration,
      error,
      handleClick,
      handleFirstInteraction,
      handleOptionChange,
      hydrated,
      isMobileDevice,
      isPending,
      markTouched,
      question.questionID,
      setSelectedValue,
    ]
  );

  const handleSubmit = useCallback(async () => {
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
  }, [
    collectBehaviorData,
    deviceID,
    handleClick,
    handleFirstInteraction,
    hydrated,
    isPending,
    isRequired,
    markAnswered,
    markAnsweredEvent,
    markSubmission,
    mutateAsync,
    onSubmitAnswer,
    question,
    selectedValue,
    setRealTimeResponse,
    surveyID,
  ]);

  const handleImmediateSubmit = useCallback(() => {
    setAutoSubmitArmed(false);
    return handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    if (isMobileDevice || !autoSubmitArmed || isPending) return;

    const timer = window.setTimeout(() => {
      setAutoSubmitArmed(false);
      void handleSubmit();
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [autoSubmitArmed, handleSubmit, isMobileDevice, isPending, selectedValue]);

  useEffect(() => {
    const handleKeyboardResponse = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (document.querySelector('[aria-modal="true"]')) return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName.toLowerCase();
        const isRangeInput = target instanceof HTMLInputElement && target.type === "range";

        if (
          (!isRangeInput && (tag === "input" || tag === "textarea" || tag === "select")) ||
          target.isContentEditable
        ) {
          return;
        }

        // A focused button already handles Enter through its native click event.
        if (event.key === "Enter" && tag === "button") return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void handleImmediateSubmit();
        return;
      }

      if (!/^[1-9]$/.test(event.key)) return;

      const value = Number(event.key);
      const minimum = Number(minValue);
      const maximum = Number(maxValue);

      if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) return;
      if (value < minimum || value > maximum) return;

      event.preventDefault();
      handleSliderChange(value);
    };

    window.addEventListener("keydown", handleKeyboardResponse);
    return () => window.removeEventListener("keydown", handleKeyboardResponse);
  }, [handleImmediateSubmit, handleSliderChange, maxValue, minValue]);

  useRegisterQuestionSubmit(true, handleImmediateSubmit);

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
          onClick={handleImmediateSubmit}
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
