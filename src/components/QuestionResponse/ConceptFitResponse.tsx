import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_CONCEPT_FIT_LEFT_TEXT,
  DEFAULT_CONCEPT_FIT_MS,
  DEFAULT_CONCEPT_FIT_RIGHT_TEXT,
} from "@/constants/screenConstants";
import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type {
  ConceptFitAnswerSide,
  ConceptFitAttributeAnswer,
  QuestionProps,
} from "@/types/questionTypes";
import { InputError } from "../alert/ResponseErrorAlert";
import { ConceptFitChoiceCard } from "./ConceptFitChoiceCard";
import { ConceptFitStimulusCard } from "./ConceptFitStimulusCard";
import { getConceptFitImage } from "@/utils/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { Countdown } from "../screen-components/Countdown";

const ConceptFitResponse = ({
  question,
  surveyID,
}: {
  question: QuestionProps["question"];
  surveyID: string;
}) => {
  const isMobile = useIsMobile();

  const { questionID, questionPreferences, options = [], type } = question || {};

  const uiConfig = questionPreferences?.uiConfig || {};

  const timeLimitMs =
    typeof uiConfig.timeLimitMs === "number" ? uiConfig.timeLimitMs : DEFAULT_CONCEPT_FIT_MS;

  const conceptDisplayMode = uiConfig.conceptDisplayMode || "TEXT";
  const showImageMode = conceptDisplayMode === "IMAGE";

  const leftText = uiConfig.conceptFitLeftText || DEFAULT_CONCEPT_FIT_LEFT_TEXT;

  const rightText = uiConfig.conceptFitRightText || DEFAULT_CONCEPT_FIT_RIGHT_TEXT;

  const attributes = useMemo(() => {
    return [...(options || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [options]);

  const conceptFitImage = getConceptFitImage(question);

  const useCompactMobileImageLayout =
    isMobile && showImageMode && Boolean(conceptFitImage?.imageUrl);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ConceptFitAttributeAnswer[]>([]);
  const [selectedSide, setSelectedSide] = useState<ConceptFitAnswerSide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const attributeStartedAtRef = useRef(Date.now());
  const hasFinishedRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const isRequired = useQuestionRequired(question);
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();

  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const { goNext } = useFlowRuntime();

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const currentAttribute = attributes[currentIndex];
  const isLastAttribute = currentIndex >= attributes.length - 1;

  /**
   * This resetKey controls the visual countdown.
   * Whenever currentIndex changes, TimeCountdown remounts/resets visually.
   */
  const timerResetKey = `${questionID}-${currentIndex}-${timeLimitMs}`;

  useEffect(() => {
    containerRef.current?.focus();
  }, [currentIndex]);

  /**
   * This controls the actual timing calculation.
   * It resets when the active attribute changes.
   */
  useEffect(() => {
    attributeStartedAtRef.current = Date.now();
    setSelectedSide(null);
    setError(null);

    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, [currentIndex, questionID]);

  const getSelectionTiming = useCallback(() => {
    const elapsedMs = Date.now() - attributeStartedAtRef.current;
    const remainingMs = Math.max(0, timeLimitMs - elapsedMs);

    return {
      selectedAtMs: elapsedMs,
      selectedAtSecondFromStart: Number((elapsedMs / 1000).toFixed(2)),
      countdownMsRemaining: remainingMs,
      countdownSecondRemaining: Number((remainingMs / 1000).toFixed(2)),
      isOverTime: elapsedMs > timeLimitMs,
    };
  }, [timeLimitMs]);

  const buildFinalResponse = useCallback(
    (finalAnswers: ConceptFitAttributeAnswer[]) => {
      return {
        questionType: "CONCEPT_FIT",
        questionID,
        surveyID,
        displayMode: conceptDisplayMode,
        timeLimitMs,
        labels: {
          left: leftText,
          right: rightText,
        },
        stimulus: showImageMode
          ? {
              type: "IMAGE",
              imageUrl: conceptFitImage?.imageUrl || null,
              imageID: conceptFitImage?.questionImageID || null,
            }
          : {
              type: "TEXT",
            },
        totalAttributes: attributes.length,
        answeredAttributes: finalAnswers.length,
        answers: finalAnswers,
        completed: finalAnswers.length === attributes.length,
        completedAt: new Date().toISOString(),
      };
    },
    [
      questionID,
      surveyID,
      conceptDisplayMode,
      timeLimitMs,
      leftText,
      rightText,
      showImageMode,
      conceptFitImage?.imageUrl,
      conceptFitImage?.questionImageID,
      attributes.length,
    ]
  );

  const finishConceptFit = useCallback(
    async (finalAnswers: ConceptFitAttributeAnswer[]) => {
      if (!questionID || hasFinishedRef.current || isPending) return;

      hasFinishedRef.current = true;

      const behavior = collectBehaviorData();
      const responseObject = buildFinalResponse(finalAnswers);

      console.log("📦 ConceptFit final response:", responseObject);
      console.log("📦 ConceptFit behavior data:", behavior);

      try {
        await mutateAsync({
          surveyID,
          deviceID,
          questionID,
          optionID: null,
          qType: type!,
          response: responseObject,
          behavior,
        });

        markAnswered(questionID);
        markSubmission();
        markAnsweredEvent();

        setRealTimeResponse(questionID, responseObject as any, null);

        goNext();
      } catch (error) {
        console.error("ConceptFit submit error:", error);

        hasFinishedRef.current = false;
        setError("Could not save your response. Please try again.");
      }
    },
    [
      questionID,
      surveyID,
      deviceID,
      type,
      isPending,
      collectBehaviorData,
      buildFinalResponse,
      mutateAsync,
      markAnswered,
      markSubmission,
      markAnsweredEvent,
      setRealTimeResponse,
      goNext,
    ]
  );

  const goToNextAttributeOrFinish = useCallback(
    (nextAnswers: ConceptFitAttributeAnswer[]) => {
      if (isLastAttribute) {
        finishConceptFit(nextAnswers);
        return;
      }

      setCurrentIndex((prev) => prev + 1);
    },
    [isLastAttribute, finishConceptFit]
  );

  const handleSelect = useCallback(
    (side: ConceptFitAnswerSide) => {
      if (!questionID || !currentAttribute) return;

      handleFirstInteraction();
      handleClick();
      handleOptionChange();
      markTouched(questionID);

      const timing = getSelectionTiming();

      const answer: ConceptFitAttributeAnswer = {
        attributeOptionID: currentAttribute.optionID,
        attributeText: currentAttribute.text || currentAttribute.value || "",
        selectedSide: side,
        selectedLabel: side === "left" ? leftText : rightText,
        selectedValue: side === "left" ? "FIT" : "DOES_NOT_FIT",
        selectedAtMs: timing.selectedAtMs,
        selectedAtSecondFromStart: timing.selectedAtSecondFromStart,
        countdownMsRemaining: timing.countdownMsRemaining,
        countdownSecondRemaining: timing.countdownSecondRemaining,
        isOverTime: timing.isOverTime,
      };

      setSelectedSide(side);
      setError(null);

      setAnswers((prev) => {
        const withoutCurrent = prev.filter(
          (item) => item.attributeOptionID !== currentAttribute.optionID
        );

        const nextAnswers = [...withoutCurrent, answer];

        if (advanceTimeoutRef.current) {
          window.clearTimeout(advanceTimeoutRef.current);
        }

        advanceTimeoutRef.current = window.setTimeout(() => {
          goToNextAttributeOrFinish(nextAnswers);
        }, 350);

        return nextAnswers;
      });
    },
    [
      questionID,
      currentAttribute,
      handleFirstInteraction,
      handleClick,
      handleOptionChange,
      markTouched,
      getSelectionTiming,
      leftText,
      rightText,
      goToNextAttributeOrFinish,
    ]
  );

  const handleManualNext = useCallback(() => {
    if (!currentAttribute) return;

    const existingAnswer = answers.find(
      (answer) => answer.attributeOptionID === currentAttribute.optionID
    );

    if (!existingAnswer) {
      if (isRequired) {
        setError("Please choose an option for this attribute");
        return;
      }

      if (isLastAttribute) {
        finishConceptFit(answers);
        return;
      }

      setCurrentIndex((prev) => prev + 1);
      return;
    }

    goToNextAttributeOrFinish(answers);
  }, [
    currentAttribute,
    answers,
    isRequired,
    isLastAttribute,
    finishConceptFit,
    goToNextAttributeOrFinish,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const key = event.key.toLowerCase();

      if (key === "e" || event.key === "ArrowLeft") {
        event.preventDefault();
        handleSelect("left");
        return;
      }

      if (key === "i" || event.key === "ArrowRight") {
        event.preventDefault();
        handleSelect("right");
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleManualNext();
      }
    },
    [handleSelect, handleManualNext]
  );

  if (!attributes.length) {
    return (
      <div className="mx-auto flex w-[92%] max-w-[620px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
        <p className="text-sm font-bold text-slate-400">
          No concept attributes are available for this question.
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "mx-auto flex h-full w-full flex-col items-center justify-center px-3 py-2",
        useCompactMobileImageLayout ? "gap-2" : "gap-3",
      ].join(" ")}
    >
      <div
        ref={containerRef}
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Concept fit response"
        className={[
          "flex w-full max-w-[820px] flex-col items-center outline-none",
          useCompactMobileImageLayout ? "gap-2" : "gap-4",
        ].join(" ")}
      >
        <div className="flex w-full items-center justify-between px-2">
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-black text-slate-400 shadow-sm md:px-3 md:text-xs">
            <span className="md:hidden">
              {currentIndex + 1}/{attributes.length}
            </span>

            <span className="hidden md:inline">
              {currentIndex + 1} of {attributes.length}
            </span>
          </span>

          <Countdown timeLimitMs={timeLimitMs} resetKey={timerResetKey} />
        </div>

        <div
          className={[
            "grid w-full items-center",
            useCompactMobileImageLayout
              ? "grid-cols-2 gap-x-8 gap-y-3"
              : "grid-cols-1 gap-8 md:grid-cols-[1fr_minmax(240px,360px)_1fr] md:gap-3",
          ].join(" ")}
        >
          <div className={useCompactMobileImageLayout ? "order-2" : ""}>
            <ConceptFitChoiceCard
              ref={leftRef}
              label={leftText}
              keyLabel="E"
              side="left"
              selected={selectedSide === "left"}
              isMobile={isMobile}
              onSelect={() => handleSelect("left")}
            />
          </div>

          <div className={useCompactMobileImageLayout ? "order-1 col-span-2" : ""}>
            <ConceptFitStimulusCard
              attributeText={
                currentAttribute?.text || currentAttribute?.value || "Untitled attribute"
              }
              showImageMode={showImageMode}
              imageUrl={conceptFitImage?.imageUrl}
              imageAlt={conceptFitImage?.altText}
              isMobile={isMobile}
            />
          </div>

          <div className={useCompactMobileImageLayout ? "order-3" : ""}>
            <ConceptFitChoiceCard
              ref={rightRef}
              label={rightText}
              keyLabel="I"
              side="right"
              selected={selectedSide === "right"}
              isMobile={isMobile}
              onSelect={() => handleSelect("right")}
            />
          </div>
        </div>

        {error && <InputError error={error} />}
      </div>
    </div>
  );
};

export default ConceptFitResponse;
