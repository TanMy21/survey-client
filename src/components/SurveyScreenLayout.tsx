import { BehaviorTrackerProvider } from "@/context/BehaviorTrackerContext";
import { SlideMotion } from "./motion/SlideMotion";
import QuestionRenderer from "./QuestionRenderer";
import { BacktrackLogger } from "./BacktrackLogger";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { END_SCREEN_TYPE } from "@/types/flowTypes";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyNavigatorCompact from "./SurveyNavigatorCompact";
import { useScrollNav } from "@/hooks/useScrollNav";
import { useHaptics } from "@/utils/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import SkipOnAdvanceBridge from "./SkipOnAdvancedBridge";
import { completeSession } from "@/api/sessionApi";
import { useSession } from "@/context/useSessionContext";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSessionActivitySync } from "@/hooks/useSessionActivitySync";
import { BehaviorEventProvider } from "@/context/BehaviorEventProvider";
import { preloadUpcomingQuestionComponent } from "@/utils/questionConfig";

const SurveyScreenLayout = ({
  surveyID,
  shareID,
  completionTimeEstimate,
}: SurveyContainerProps) => {
  const {
    currentQuestion,
    currentQuestionID,
    currentDisplayIndex,
    nextQuestion,
    flowEligible,
    canGoPrev,
    isTerminal,
  } = useFlowRuntime();
  useSessionActivitySync(surveyID!);
  const runtime = useFlowRuntime();
  const { canProceed } = useSurveyFlow();
  const isEnd = currentQuestion.type === "END_SCREEN";
  const isWelcome = currentQuestion.type === "WELCOME_SCREEN";
  const isConsentScreen = currentQuestion.type === "CONSENT";
  const canScrollNext = !isConsentScreen && canProceed;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const deviceID = useDeviceId();
  const { session } = useSession();
  const visitedRef = useRef<string[]>([]);
  const backtrackCountMapRef = useRef<Map<string, number>>(new Map());
  const [navPulse, setNavPulse] = useState<"next" | "prev" | null>(null);
  const { vibrate } = useHaptics();

  const guardedGoNext = useCallback(() => {
    runtime.goNext();
  }, [runtime]);

  const guardedGoPrev = useCallback(() => {
    runtime.onPrev();
  }, [runtime]);

  useScrollNav({
    container: scrollRef,
    goNext: guardedGoNext,
    goPrev: guardedGoPrev,
    canGoPrev,
    canGoNext: canScrollNext,
    isEnd,
    cooldownMs: 600,
    wheelThreshold: 180,
    touchThreshold: 48,
    onNavigate: (dir) => {
      setNavPulse(dir);
      vibrate(8);
      setTimeout(() => setNavPulse(null), 720);
    },
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [currentQuestionID]);

  const hasEndScreen = useMemo(
    () => flowEligible.some((q) => q.type === END_SCREEN_TYPE),
    [flowEligible]
  );

  const completionRef = useRef(false);

  useEffect(() => {
    if (!currentQuestion || !session) return;
    if (completionRef.current) return;

    const shouldComplete = hasEndScreen ? isEnd : isTerminal;

    // if (!shouldComplete) return;

    if (shouldComplete) {
      completionRef.current = true;

      completeSession({
        surveyID,
        deviceID,
        shareID: shareID!,
      }).catch((err) => console.error("Error completing session:", err));
    }
  }, [currentQuestionID, session, hasEndScreen, isEnd, isTerminal, surveyID, deviceID, shareID]);

  // progress
  const progressQuestions = useMemo(
    () => flowEligible.filter((question) => question.type !== END_SCREEN_TYPE),
    [flowEligible]
  );

  const progressPercent = useMemo(() => {
    if (isEnd) return 100;

    const currentPosition = progressQuestions.findIndex(
      (question) => question.questionID === currentQuestionID
    );

    if (currentPosition < 0 || progressQuestions.length === 0) {
      return 0;
    }

    return ((currentPosition + 1) / progressQuestions.length) * 100;
  }, [currentQuestionID, progressQuestions, isEnd]);

  const { questionPreferences } = currentQuestion || {};

  const nextImageUrl = nextQuestion?.questionPreferences?.questionImageTemplateUrl;

  const nextQuestionType = nextQuestion?.type;

  const { questionImageTemplate, questionImageTemplateUrl, questionBackgroundColor } =
    questionPreferences || {};
  const backgroundStyle = questionImageTemplate
    ? {
        backgroundColor: questionBackgroundColor || "white",
        backgroundImage: `url(${questionImageTemplateUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : questionBackgroundColor
      ? { backgroundColor: questionBackgroundColor }
      : { backgroundColor: "white" };

  // Preloads current and next background images so the browser has them ready before paint/navigation.
  useEffect(() => {
    const urls = [questionImageTemplateUrl, nextImageUrl].filter(Boolean) as string[];

    urls.forEach((url) => {
      const image = new Image();

      // Starts fetching the image and allows browser cache to reuse it later.
      image.src = url;
    });
  }, [questionImageTemplateUrl, nextImageUrl]);

  useEffect(() => {
    if (
      nextQuestionType !== "MEDIA" &&
      nextQuestionType !== "RANK" &&
      nextQuestionType !== "THREE_D"
    ) {
      return;
    }

    preloadUpcomingQuestionComponent(nextQuestionType);
  }, [nextQuestionType]);

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white md:h-screen">
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {/* gap */}
      <div className="h-1" />

      <div className="flex min-h-0 w-full flex-1 flex-col" style={backgroundStyle}>
        <div
          ref={scrollRef}
          style={{ touchAction: "pan-y" }}
          className="scrollbar-hidden flex min-h-0 w-full flex-1 flex-col items-stretch overflow-x-hidden overflow-y-auto"
        >
          <BehaviorEventProvider>
            <SlideMotion direction={"right"} keyProp={currentQuestionID}>
              <BehaviorTrackerProvider
                questionID={currentQuestionID}
                questionType={currentQuestion.type}
                backtrackCountMapRef={backtrackCountMapRef}
              >
                <SkipOnAdvanceBridge surveyID={surveyID!} />
                <BacktrackLogger questionID={currentQuestionID} visitedRef={visitedRef} />
                <QuestionRenderer
                  question={currentQuestion}
                  surveyID={shareID}
                  currentIndex={currentDisplayIndex!}
                  completionTimeEstimate={completionTimeEstimate}
                />
              </BehaviorTrackerProvider>
            </SlideMotion>
          </BehaviorEventProvider>
        </div>
      </div>
      <SurveyNavigatorCompact disableNext={!canProceed} navPulse={navPulse} shareID={shareID} />
    </div>
  );
};

export default SurveyScreenLayout;
