import { DEFAULT_IAT_TIME_LIMIT_MS } from "@/constants/screenConstants";
import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import type {
  IATAnswer,
  IATGroup,
  IATRoundType,
  IATSide,
  IATStimulus,
  QuestionProps,
} from "@/types/questionTypes";
import {
  getExpectedSideForIATStimulus,
  getIATOptionGroup,
  getIATRoundTargets,
  getParticipantIATUiConfig,
} from "@/utils/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IATCountdown } from "../screen-components/IATCountdown";
import { IATStimulusCard } from "./IATStimulusCard";
import { IATCategoryTargetCard } from "./IATCategoryCard";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { ArrowLeftRight } from "lucide-react";

const IATResponse = ({
  question,
  surveyID,
}: {
  question: QuestionProps["question"];
  surveyID: string;
}) => {
  const { questionID, questionPreferences, options = [] } = question || {};

  const uiConfig = getParticipantIATUiConfig(questionPreferences?.uiConfig);

  const timeLimitMs =
    typeof uiConfig.timeLimitMs === "number" ? uiConfig.timeLimitMs : DEFAULT_IAT_TIME_LIMIT_MS;

  const stimuli = useMemo<IATStimulus[]>(() => {
    const themeA = [...(options || [])]
      .filter((option) => getIATOptionGroup(option.settings) === "THEME_A")
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((option) => ({
        optionID: option.optionID,
        text: option.text || option.value || "",
        value: option.value,
        order: option.order,
        group: "THEME_A" as IATGroup,
      }));

    const themeB = [...(options || [])]
      .filter((option) => getIATOptionGroup(option.settings) === "THEME_B")
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((option) => ({
        optionID: option.optionID,
        text: option.text || option.value || "",
        value: option.value,
        order: option.order,
        group: "THEME_B" as IATGroup,
      }));

    return [...themeA, ...themeB];
  }, [options]);

  const [round, setRound] = useState<IATRoundType>("INITIAL");
  const [stimulusIndex, setStimulusIndex] = useState(0);
  const [answers, setAnswers] = useState<IATAnswer[]>([]);
  const [selectedSide, setSelectedSide] = useState<IATSide | null>(null);
  const [flashRoundNotice, setFlashRoundNotice] = useState(false);
  const previousRoundRef = useRef<IATRoundType>("INITIAL");

  const stimulusStartedAtRef = useRef(Date.now());
  const hasFinishedRef = useRef(false);
  const isAdvancingRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { markTouched, markAnswered } = useResponseRegistry();
  const { goNext } = useFlowRuntime();

  const isRequired = useQuestionRequired(question);

  const skipAllowed =
    !isRequired ||
    Boolean(uiConfig.allowSkip || uiConfig.iatAllowSkip || (question as any)?.allowSkip);

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const currentStimulus = stimuli[stimulusIndex];
  const roundIndex = round === "INITIAL" ? 1 : 2;
  const currentTrialNumber = (round === "INITIAL" ? 0 : stimuli.length) + stimulusIndex + 1;
  const totalTrials = stimuli.length * 2;

  const roundTargets = getIATRoundTargets(round, uiConfig);
  const resetKey = `${round}-${stimulusIndex}-${questionID}`;

  /**
   * Resets timing and keyboard focus whenever a new stimulus appears.
   */
  useEffect(() => {
    stimulusStartedAtRef.current = Date.now();
    isAdvancingRef.current = false;
    setSelectedSide(null);
    containerRef.current?.focus();

    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, [round, stimulusIndex, questionID]);

  useEffect(() => {
    if (previousRoundRef.current !== round && round === "REVERSED") {
      setFlashRoundNotice(true);

      const timeoutID = window.setTimeout(() => {
        setFlashRoundNotice(false);
      }, 950);

      previousRoundRef.current = round;

      return () => {
        window.clearTimeout(timeoutID);
      };
    }

    previousRoundRef.current = round;
  }, [round]);

  const getSelectionTiming = useCallback(() => {
    const elapsedMs = Date.now() - stimulusStartedAtRef.current;
    const remainingMs = Math.max(0, timeLimitMs - elapsedMs);

    return {
      responseTimeMs: elapsedMs,
      responseTimeSeconds: Number((elapsedMs / 1000).toFixed(2)),
      countdownMsRemaining: remainingMs,
      countdownSecondsRemaining: Number((remainingMs / 1000).toFixed(2)),
      isOverTime: elapsedMs > timeLimitMs,
    };
  }, [timeLimitMs]);

  const buildFinalResponse = useCallback(
    (
      finalAnswers: IATAnswer[],
      skipped = false,
      skipMeta?: {
        skippedAtRound: IATRoundType;
        skippedAtRoundIndex: number;
        skippedAtStimulusIndex: number;
        skippedAtTrialNumber: number;
        currentStimulusOptionID?: string;
        currentStimulusText?: string;
      }
    ) => {
      return {
        questionType: "IAT",
        questionID,
        surveyID,
        timeLimitMs,
        keys: {
          left: uiConfig.iatLeftKey,
          right: uiConfig.iatRightKey,
        },
        rounds: [
          {
            round: "INITIAL",
            left: {
              brand: uiConfig.iatBrandA.label,
              theme: uiConfig.iatThemeA.label,
            },
            right: {
              brand: uiConfig.iatBrandB.label,
              theme: uiConfig.iatThemeB.label,
            },
          },
          {
            round: "REVERSED",
            left: {
              brand: uiConfig.iatBrandA.label,
              theme: uiConfig.iatThemeB.label,
            },
            right: {
              brand: uiConfig.iatBrandB.label,
              theme: uiConfig.iatThemeA.label,
            },
          },
        ],
        totalStimuliPerRound: stimuli.length,
        totalTrials,
        answeredTrials: finalAnswers.length,
        answers: finalAnswers,
        completed: !skipped && finalAnswers.length === totalTrials,
        skipped,
        skipMeta: skipped ? (skipMeta ?? null) : null,
        completedAt: skipped ? null : new Date().toISOString(),
        skippedAt: skipped ? new Date().toISOString() : null,
      };
    },
    [
      questionID,
      surveyID,
      timeLimitMs,
      uiConfig.iatLeftKey,
      uiConfig.iatRightKey,
      uiConfig.iatBrandA.label,
      uiConfig.iatBrandB.label,
      uiConfig.iatThemeA.label,
      uiConfig.iatThemeB.label,
      stimuli.length,
      totalTrials,
    ]
  );

  const finishIAT = useCallback(
    (
      finalAnswers: IATAnswer[],
      skipped = false,
      skipMeta?: {
        skippedAtRound: IATRoundType;
        skippedAtRoundIndex: number;
        skippedAtStimulusIndex: number;
        skippedAtTrialNumber: number;
        currentStimulusOptionID?: string;
        currentStimulusText?: string;
      }
    ) => {
      if (!questionID || hasFinishedRef.current) return;

      hasFinishedRef.current = true;

      markAnswered(questionID);
      markSubmission();
      markAnsweredEvent();

      const behavior = collectBehaviorData();
      const responseObject = buildFinalResponse(finalAnswers, skipped, skipMeta);

      console.log("📦 IAT final response:", responseObject);
      console.log("📦 IAT behavior data:", behavior);

      goNext();
    },
    [
      questionID,
      markAnswered,
      markSubmission,
      markAnsweredEvent,
      collectBehaviorData,
      buildFinalResponse,
      goNext,
    ]
  );

  const goToNextStimulusOrRound = useCallback(
    (nextAnswers: IATAnswer[]) => {
      const isLastStimulusInRound = stimulusIndex >= stimuli.length - 1;

      if (!isLastStimulusInRound) {
        setStimulusIndex((prev) => prev + 1);
        return;
      }

      if (round === "INITIAL") {
        setRound("REVERSED");
        setStimulusIndex(0);
        return;
      }

      finishIAT(nextAnswers);
    },
    [stimulusIndex, stimuli.length, round, finishIAT]
  );

  const handleSelect = useCallback(
    (side: IATSide) => {
      if (!questionID || !currentStimulus || isAdvancingRef.current) return;

      isAdvancingRef.current = true;

      handleFirstInteraction();
      handleClick();
      handleOptionChange();
      markTouched(questionID);

      const timing = getSelectionTiming();
      const expectedSide = getExpectedSideForIATStimulus(currentStimulus.group, round);

      const selectedPair = side === "left" ? roundTargets.left : roundTargets.right;
      const selectedKey = side === "left" ? uiConfig.iatLeftKey : uiConfig.iatRightKey;

      const answer: IATAnswer = {
        round,
        roundIndex,
        stimulusIndex: stimulusIndex + 1,
        stimulusOptionID: currentStimulus.optionID,
        stimulusText: currentStimulus.text,
        stimulusGroup: currentStimulus.group,
        selectedSide: side,
        selectedKey,
        selectedPair,
        expectedSide,
        isExpectedSide: side === expectedSide,
        responseTimeMs: timing.responseTimeMs,
        responseTimeSeconds: timing.responseTimeSeconds,
        countdownMsRemaining: timing.countdownMsRemaining,
        countdownSecondsRemaining: timing.countdownSecondsRemaining,
        isOverTime: timing.isOverTime,
        answeredAt: new Date().toISOString(),
      };

      setSelectedSide(side);

      setAnswers((prev) => {
        const nextAnswers = [...prev, answer];

        if (advanceTimeoutRef.current) {
          window.clearTimeout(advanceTimeoutRef.current);
        }

        advanceTimeoutRef.current = window.setTimeout(() => {
          goToNextStimulusOrRound(nextAnswers);
        }, 280);

        return nextAnswers;
      });
    },
    [
      questionID,
      currentStimulus,
      handleFirstInteraction,
      handleClick,
      handleOptionChange,
      markTouched,
      getSelectionTiming,
      round,
      roundIndex,
      stimulusIndex,
      roundTargets.left,
      roundTargets.right,
      uiConfig.iatLeftKey,
      uiConfig.iatRightKey,
      goToNextStimulusOrRound,
    ]
  );

  const handleSkip = useCallback(() => {
    if (!skipAllowed) return;

    const skipMeta = {
      skippedAtRound: round,
      skippedAtRoundIndex: roundIndex,
      skippedAtStimulusIndex: stimulusIndex + 1,
      skippedAtTrialNumber: currentTrialNumber,
      currentStimulusOptionID: currentStimulus?.optionID,
      currentStimulusText: currentStimulus?.text,
    };

    finishIAT(answers, true, skipMeta);
  }, [
    skipAllowed,
    round,
    roundIndex,
    stimulusIndex,
    currentTrialNumber,
    currentStimulus?.optionID,
    currentStimulus?.text,
    finishIAT,
    answers,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const key = event.key.toLowerCase();

      if (key === uiConfig.iatLeftKey.toLowerCase() || event.key === "ArrowLeft") {
        event.preventDefault();
        handleSelect("left");
        return;
      }

      if (key === uiConfig.iatRightKey.toLowerCase() || event.key === "ArrowRight") {
        event.preventDefault();
        handleSelect("right");
      }
    },
    [handleSelect, uiConfig.iatLeftKey, uiConfig.iatRightKey]
  );

  if (!stimuli.length) {
    return (
      <div className="mx-auto flex w-[92%] max-w-[620px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
        <p className="text-sm font-bold text-slate-400">
          No IAT attributes are available for this question.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-3 px-2 py-4 md:px-3 md:py-2">
      <div
        ref={containerRef}
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Implicit association test. Press ${uiConfig.iatLeftKey} for left and ${uiConfig.iatRightKey} for right.`}
        className="flex w-full max-w-[860px] flex-col items-center gap-4 outline-none"
      >
        <div className="flex w-full items-center justify-between px-2">
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-black text-slate-400 shadow-sm md:px-3 md:text-xs">
            <span className="md:hidden">
              {currentTrialNumber}/{totalTrials}
            </span>

            <span className="hidden md:inline">
              {currentTrialNumber} of {totalTrials}
            </span>
          </span>

          <div className="flex min-w-0 items-center justify-center">
            <p
              className={[
                "rounded-full border px-3 py-1.5 text-sm font-black transition-all duration-300 md:px-4 md:text-base",
                flashRoundNotice
                  ? "scale-[1.05] border-pink-200 bg-pink-50 text-pink-600 shadow-[0_8px_22px_rgba(219,39,119,0.16)]"
                  : "border-slate-200 bg-white text-slate-400 shadow-sm",
              ].join(" ")}
            >
              {/* Mobile compact version */}
              <span className="flex items-center gap-1.5 md:hidden">
                {round === "REVERSED" && (
                  <ArrowLeftRight
                    size={14}
                    strokeWidth={3}
                    className={flashRoundNotice ? "text-pink-600" : "text-slate-400"}
                  />
                )}

                <span>R{roundIndex}/2</span>
              </span>

              {/* Desktop readable version */}
              <span className="hidden md:inline">
                Round {roundIndex}/2 · {round === "INITIAL" ? "First pairing" : "Pairings switched"}
              </span>
            </p>
          </div>

          <IATCountdown timeLimitMs={timeLimitMs} resetKey={resetKey} />
        </div>

        <div className="w-full">
          <div className="hidden w-full grid-cols-[1fr_minmax(180px,260px)_1fr] items-center gap-4 md:grid">
            <IATCategoryTargetCard
              side="left"
              toneSide={round === "REVERSED" ? "right" : "left"}
              keyLabel={uiConfig.iatLeftKey}
              brand={roundTargets.left.brand}
              association={roundTargets.left.theme}
              selected={selectedSide === "left"}
              onSelect={() => handleSelect("left")}
            />

            <IATStimulusCard stimulus={currentStimulus.text} />

            <IATCategoryTargetCard
              side="right"
              toneSide={round === "REVERSED" ? "left" : "right"}
              keyLabel={uiConfig.iatRightKey}
              brand={roundTargets.right.brand}
              association={roundTargets.right.theme}
              selected={selectedSide === "right"}
              onSelect={() => handleSelect("right")}
            />
          </div>

          <div className="flex w-full flex-col gap-8 md:hidden">
            <IATStimulusCard stimulus={currentStimulus.text} />

            <div className="grid grid-cols-2 gap-3">
              <IATCategoryTargetCard
                side="left"
                toneSide={round === "REVERSED" ? "right" : "left"}
                keyLabel={uiConfig.iatLeftKey}
                brand={roundTargets.left.brand}
                association={roundTargets.left.theme}
                selected={selectedSide === "left"}
                onSelect={() => handleSelect("left")}
                compact
              />

              <IATCategoryTargetCard
                side="right"
                toneSide={round === "REVERSED" ? "left" : "right"}
                keyLabel={uiConfig.iatRightKey}
                brand={roundTargets.right.brand}
                association={roundTargets.right.theme}
                selected={selectedSide === "right"}
                onSelect={() => handleSelect("right")}
                compact
              />
            </div>
          </div>
        </div>

        <div className="mt-4 hidden w-full items-center justify-end px-2 md:flex">
          {skipAllowed && (
            <button
              type="button"
              onClick={handleSkip}
              className="min-w-[82px] rounded-[20px] bg-[#005BC4] px-4 py-2 text-sm font-black text-white transition hover:bg-[#004a9f]"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IATResponse;
