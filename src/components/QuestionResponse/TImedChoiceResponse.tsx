import { DEFAULT_TIMED_CHOICE_MS } from "@/constants/screenConstants";
import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { BinaryResponseContainerProps } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { TimedChoiceOptionCard } from "./TimedChoiceOptionCard";
import { getTimedChoiceOptionImage } from "@/utils/utils";

const TimedChoiceResponse = ({ question, surveyID }: BinaryResponseContainerProps) => {
  const { questionID, questionPreferences, options = [] } = question;

  const uiConfig = questionPreferences?.uiConfig || {};

  const timeLimitMs =
    typeof uiConfig.timeLimitMs === "number" ? uiConfig.timeLimitMs : DEFAULT_TIMED_CHOICE_MS;

  const displayMode = uiConfig.timedChoiceDisplayMode || "TEXT";
  const showImages = displayMode === "IMAGE" || displayMode === "TEXT_IMAGE";

  const sortedOptions = [...options].sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 2);

  const firstOption = sortedOptions[0];
  const secondOption = sortedOptions[1];

  const firstOptionValue = firstOption?.value || firstOption?.text || "Option A";

  const secondOptionValue = secondOption?.value || secondOption?.text || "Option B";

  const firstOptionText = firstOption?.text || "Option A";
  const secondOptionText = secondOption?.text || "Option B";

  const firstImage = getTimedChoiceOptionImage(question, "left");
  const secondImage = getTimedChoiceOptionImage(question, "right");

  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedOptionID, setSelectedOptionID] = useState<string | null>(null);
  const [selectedAtMs, setSelectedAtMs] = useState<number | null>(null);

  const startedAtRef = useRef(Date.now());
  const hasLoggedTimeoutRef = useRef(false);

  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);

  const isRequired = useQuestionRequired(question);
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();
  const { onSubmitAnswer } = useFlowRuntime();

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  /**
   * Starts the countdown timing window for this question.
   */
  useEffect(() => {
    startedAtRef.current = Date.now();
    hasLoggedTimeoutRef.current = false;
    setSelectedValue(null);
    setSelectedOptionID(null);
    setSelectedAtMs(null);
  }, [questionID, timeLimitMs]);

  /**
   * Logs timeout for now.
   * Later this can submit a timeout response if needed.
   */
  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      if (selectedValue || hasLoggedTimeoutRef.current) return;

      hasLoggedTimeoutRef.current = true;

      console.log("⏱️ TimedChoice timeout:", {
        surveyID,
        questionID,
        qType: question.type,
        timeLimitMs,
        selected: false,
      });
    }, timeLimitMs);

    return () => {
      window.clearTimeout(timeoutID);
    };
  }, [selectedValue, surveyID, questionID, question.type, timeLimitMs]);

  const getSelectionTiming = useCallback(() => {
    const elapsedMs = Date.now() - startedAtRef.current;
    const remainingMs = Math.max(0, timeLimitMs - elapsedMs);

    return {
      selectedAtMs: elapsedMs,
      selectedAtSecondFromStart: Number((elapsedMs / 1000).toFixed(2)),
      countdownMsRemaining: remainingMs,
      countdownSecondRemaining: Number((remainingMs / 1000).toFixed(2)),
    };
  }, [timeLimitMs]);

  const handleSelect = useCallback(
    (nextValue: string, optionID: string | null) => {
      handleFirstInteraction();
      handleClick();
      markTouched(questionID);

      if (selectedValue !== nextValue) {
        handleOptionChange();
      }

      const timing = getSelectionTiming();

      setSelectedValue(nextValue);
      setSelectedOptionID(optionID);
      setSelectedAtMs(timing.selectedAtMs);
      setError(null);

      console.log("⚡ TimedChoice option selected:", {
        surveyID,
        questionID,
        qType: question.type,
        optionID,
        value: nextValue,
        selectedAtSecondFromStart: timing.selectedAtSecondFromStart,
        countdownSecondRemaining: timing.countdownSecondRemaining,
      });
    },
    [
      handleFirstInteraction,
      handleClick,
      markTouched,
      questionID,
      selectedValue,
      handleOptionChange,
      getSelectionTiming,
      surveyID,
      question.type,
    ]
  );

  const handleSubmit = useCallback(async () => {
    if (isRequired && !selectedValue) {
      setError("Your response is required for this question");
      return;
    }

    if (!questionID || !selectedValue) return;

    markAnswered(questionID);
    markSubmission();
    markAnsweredEvent();

    const behavior = collectBehaviorData();

    const elapsedMs = selectedAtMs !== null ? selectedAtMs : Date.now() - startedAtRef.current;

    const remainingMs = Math.max(0, timeLimitMs - elapsedMs);

    /**
     * Temporary only.
     * Backend submission will be added later.
     */
    console.log("📦 TimedChoice behavior data:", behavior);
    console.log("TimedChoice selected response:", {
      surveyID,
      questionID,
      qType: question.type,
      optionID: selectedOptionID,
      response: selectedValue,
      selectedAtMs: elapsedMs,
      selectedAtSecondFromStart: Number((elapsedMs / 1000).toFixed(2)),
      countdownMsRemaining: remainingMs,
      countdownSecondRemaining: Number((remainingMs / 1000).toFixed(2)),
      displayMode,
    });

    setRealTimeResponse(questionID, selectedValue, null);

    setError(null);
    onSubmitAnswer(selectedValue);
  }, [
    isRequired,
    selectedValue,
    questionID,
    markAnswered,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
    selectedAtMs,
    timeLimitMs,
    surveyID,
    question.type,
    selectedOptionID,
    displayMode,
    setRealTimeResponse,
    onSubmitAnswer,
  ]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const getPulseTargets = useCallback(() => {
    if (selectedValue === firstOptionValue) return [firstRef.current];
    if (selectedValue === secondOptionValue) return [secondRef.current];

    return [];
  }, [selectedValue, firstOptionValue, secondOptionValue]);

  useAutoSubmitPulse({
    active: selectedValue !== null,
    delayMs: 900,
    feedbackMs: 160,
    onSubmit: handleSubmit,
    getPulseTargets,
    vibrate: true,
  });

  const onOptionKeyDown =
    (onSelect: () => void) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    };

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2 p-2 sm:w-4/5">
      <div
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Timed choice response container"
        className="flex h-full w-[98%] flex-col gap-2 md:w-4/5"
      >
        <div className="mx-auto grid h-full w-[98%] grid-cols-1 gap-3 sm:w-[86%] md:grid-cols-2">
          <div
            ref={firstRef}
            role="radio"
            aria-checked={selectedValue === firstOptionValue}
            tabIndex={0}
            onClick={() => handleSelect(firstOptionValue, firstOption?.optionID || null)}
            onKeyDown={onOptionKeyDown(() =>
              handleSelect(firstOptionValue, firstOption?.optionID || null)
            )}
            className="cursor-pointer rounded-2xl outline-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <TimedChoiceOptionCard
              text={firstOptionText}
              imageUrl={showImages ? firstImage?.imageUrl : undefined}
              altText={firstImage?.altText}
              selected={selectedValue === firstOptionValue}
              side="left"
            />
          </div>

          <div
            ref={secondRef}
            role="radio"
            aria-checked={selectedValue === secondOptionValue}
            tabIndex={0}
            onClick={() => handleSelect(secondOptionValue, secondOption?.optionID || null)}
            onKeyDown={onOptionKeyDown(() =>
              handleSelect(secondOptionValue, secondOption?.optionID || null)
            )}
            className="cursor-pointer rounded-2xl outline-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <TimedChoiceOptionCard
              text={secondOptionText}
              imageUrl={showImages ? secondImage?.imageUrl : undefined}
              altText={secondImage?.altText}
              selected={selectedValue === secondOptionValue}
              side="right"
            />
          </div>
        </div>

        {error && <InputError error={error} />}

        <div className="mt-4 flex w-full justify-end pr-6">
          <button
            onClick={handleSubmit}
            className="w-[80px] rounded-[20px] bg-[#005BC4] px-4 py-2 font-bold text-white transition hover:bg-[#004a9f]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimedChoiceResponse;
