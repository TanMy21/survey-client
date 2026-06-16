import { DEFAULT_TIMED_CHOICE_MS } from "@/constants/screenConstants";
import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { BinaryResponseContainerProps } from "@/types/responseTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { TimedChoiceOptionCard } from "./TimedChoiceOptionCard";
import { getTimedChoiceOptionImage } from "@/utils/utils";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { Countdown } from "../screen-components/Countdown";
import { useRegisterQuestionSubmit } from "@/context/QuestionNavigationContext";

const TimedChoiceResponse = ({ question, surveyID }: BinaryResponseContainerProps) => {
  const { questionID, questionPreferences, options = [] } = question;

  const uiConfig = questionPreferences?.uiConfig || {};

  const timeLimitMs =
    typeof uiConfig.timeLimitMs === "number" ? uiConfig.timeLimitMs : DEFAULT_TIMED_CHOICE_MS;

  const displayMode = uiConfig.timedChoiceDisplayMode || "TEXT";
  const showImages = displayMode === "IMAGE" || displayMode === "TEXT_IMAGE";

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 2);
  }, [options]);

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
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  const startedAtRef = useRef(Date.now());
  const isSubmittingRef = useRef(false);

  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);

  const isRequired = useQuestionRequired(question);

  const {
    markTouched,
    markAnswered,
    setRealTimeResponse,
    getRealTimeResponse,
    persistedResponses,
  } = useResponseRegistry();

  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const { onSubmitAnswer } = useFlowRuntime();

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const timerResetKey = `${questionID}-${timeLimitMs}`;

  /**
   * Starts the timing window and hydrates selected UI if participant
   * returns to this question on the same device/session.
   */
  useEffect(() => {
    startedAtRef.current = Date.now();

    /**
     * Hydrated response should only show selected UI.
     * It should not trigger auto-submit again.
     */
    setShouldAutoSubmit(false);
    setError(null);
    setSelectedAtMs(null);
    isSubmittingRef.current = false;

    const liveResponse = getRealTimeResponse(questionID);
    const persistedResponse = persistedResponses?.[questionID] ?? null;

    const savedResponse = liveResponse ?? persistedResponse;

    if (!savedResponse) {
      setSelectedValue(null);
      setSelectedOptionID(null);
      return;
    }

    const savedPayload = savedResponse.value;

    const savedValue =
      typeof savedPayload === "string" ? savedPayload : (savedPayload?.selectedValue ?? null);

    if (!savedValue) {
      setSelectedValue(null);
      setSelectedOptionID(null);
      return;
    }

    const matchedOption = sortedOptions.find((option) => {
      const optionValue = option.value || option.text;
      return optionValue === savedValue;
    });

    setSelectedValue(savedValue);
    setSelectedOptionID(savedResponse.optionID || matchedOption?.optionID || null);
  }, [questionID, timeLimitMs, getRealTimeResponse, persistedResponses, sortedOptions]);

  /**
   * Captures the second/ms at which participant selected the option.
   * This remains independent from the visual countdown.
   */
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
      setShouldAutoSubmit(true);
      setError(null);
    },
    [
      handleFirstInteraction,
      handleClick,
      markTouched,
      questionID,
      selectedValue,
      handleOptionChange,
      getSelectionTiming,
    ]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current || isPending) return;

    if (isRequired && !selectedValue) {
      setError("Your response is required for this question");
      return;
    }

    if (!questionID || !selectedValue) return;

    isSubmittingRef.current = true;

    const behavior = collectBehaviorData();

    const elapsedMs = selectedAtMs !== null ? selectedAtMs : Date.now() - startedAtRef.current;

    const remainingMs = Math.max(0, timeLimitMs - elapsedMs);

    const timedChoiceResponse = {
      selectedValue,
      displayMode,
      timeLimitMs,
      timing: {
        responseTimeMs: elapsedMs,
        responseTimeSeconds: Number((elapsedMs / 1000).toFixed(2)),
        countdownRemainingMs: remainingMs,
        countdownRemainingSeconds: Number((remainingMs / 1000).toFixed(2)),
        isOverTime: elapsedMs > timeLimitMs,
      },
      answeredAt: new Date().toISOString(),
    };

    try {
      await mutateAsync({
        surveyID,
        deviceID,
        questionID,
        optionID: selectedOptionID,
        qType: question.type,
        response: timedChoiceResponse,
        behavior,
      });

      markAnswered(questionID);
      markSubmission();
      markAnsweredEvent();

      setRealTimeResponse(questionID, timedChoiceResponse, selectedOptionID);
      setShouldAutoSubmit(false);
      setError(null);

      onSubmitAnswer(selectedValue);
    } catch (error) {
      console.error("TimedChoice submit error:", error);
      isSubmittingRef.current = false;
      setShouldAutoSubmit(false);
      setError("Could not save your response. Please try again.");
    }
  }, [
    isRequired,
    selectedValue,
    questionID,
    isPending,
    collectBehaviorData,
    selectedAtMs,
    timeLimitMs,
    displayMode,
    mutateAsync,
    surveyID,
    deviceID,
    selectedOptionID,
    question.type,
    markAnswered,
    markSubmission,
    markAnsweredEvent,
    setRealTimeResponse,
    onSubmitAnswer,
  ]);

  useRegisterQuestionSubmit(isRequired || !!selectedValue, handleSubmit);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const getPulseTargets = useCallback(() => {
    if (selectedValue === firstOptionValue) return [firstRef.current];
    if (selectedValue === secondOptionValue) return [secondRef.current];

    return [];
  }, [selectedValue, firstOptionValue, secondOptionValue]);

  useAutoSubmitPulse({
    active: shouldAutoSubmit && selectedValue !== null && !isPending,
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
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-3 px-2 py-3 sm:w-4/5 md:px-3 md:py-2">
      <div
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Timed choice response container"
        className="flex h-full w-[98%] flex-col gap-3 outline-none md:w-4/5"
      >
        <div className="flex w-full items-center justify-end px-2">
          <Countdown timeLimitMs={timeLimitMs} resetKey={timerResetKey} />
        </div>

        <div className="mx-auto grid h-full w-[98%] grid-cols-1 gap-6 sm:w-[86%] md:grid-cols-2">
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
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-[80px] rounded-[20px] bg-[#005BC4] px-4 py-2 font-bold text-white transition hover:bg-[#004a9f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimedChoiceResponse;
