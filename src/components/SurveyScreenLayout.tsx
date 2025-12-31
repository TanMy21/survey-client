import { BehaviorTrackerProvider } from "@/context/BehaviorTrackerContext";
import { SlideMotion } from "./motion/SlideMotion";
import QuestionRenderer from "./QuestionRenderer";
import { BacktrackLogger } from "./BacktrackLogger";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { END_SCREEN_TYPE, NON_FLOW_TYPES } from "@/types/flowTypes";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyNavigatorCompact from "./SurveyNavigatorCompact";
import { useScrollNav } from "@/hooks/useScrollNav";
import { useSwipeNav } from "@/hooks/useSwipeNav";
import { useHaptics } from "@/utils/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import SkipOnAdvanceBridge from "./SkipOnAdvancedBridge";
import { completeSession } from "@/api/sessionApi";
import { useSession } from "@/context/useSessionContext";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSessionActivitySync } from "@/hooks/useSessionActivitySync";
 

const SurveyScreenLayout = ({ surveyID, shareID }: SurveyContainerProps) => {
  const {
    currentQuestion,
    currentQuestionID,
    currentDisplayIndex,
    visitedStack,
    flowEligible,
    canGoPrev,
    isTerminal,
  } = useFlowRuntime();
  useSessionActivitySync(surveyID!); 
  const runtime = useFlowRuntime();
  const { canProceed } = useSurveyFlow();
  const isEnd = currentQuestion.type === "END_SCREEN";
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
    wheelThreshold: 100,
    touchThreshold: 48,
    onNavigate: (dir) => {
      setNavPulse(dir);
      vibrate(8);
      setTimeout(() => setNavPulse(null), 720);
    },
  });

  useSwipeNav({
    container: scrollRef,
    goNext: () => {
      guardedGoNext();
      setNavPulse("next");
      vibrate(8);
      setTimeout(() => setNavPulse(null), 720);
    },
    goPrev: () => {
      guardedGoPrev();
      setNavPulse("prev");
      vibrate(8);
      setTimeout(() => setNavPulse(null), 720);
    },
    canGoPrev,
    canGoNext: canScrollNext,
    isEnd,
    cooldownMs: 500,
    swipeThreshold: 56,
    dirBias: 1.6,
    mobileQuery: "(pointer:coarse)",
  });

  // useEffect(() => {
  //   if (surveyID) quizSessionStarted(surveyID);
  // }, [surveyID]);

  // const sessions = data?.sessions ?? [];

  //   usePreloadNeighbors(questions, currentQuestionIndex, 1);

  // if (isSessionCompleted(sessions)) {
  //   return (
  //     <div className="flex justify-center items-center h-screen p-4 text-center bg-white">
  //       <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
  //         You have already completed the survey.
  //       </h1>
  //     </div>
  //   );
  // }

  //   if (!questions.length) {
  //     return (
  //       <div className="flex h-screen w-full items-center justify-center">Error Loading Survey.</div>
  //     );
  //   }

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
  const totalCount = useMemo(
    () => flowEligible.filter((q) => !NON_FLOW_TYPES.has(q.type)).length,
    [flowEligible]
  );
  const progressPercent = useMemo(() => {
    const visitedQuestions = visitedStack.filter((qid) => {
      const q = flowEligible.find((x) => x.questionID === qid);
      return q && !NON_FLOW_TYPES.has(q.type);
    }).length;
    return totalCount > 0 ? (visitedQuestions / totalCount) * 100 : 0;
  }, [visitedStack, flowEligible, totalCount]);

  const { questionPreferences } = currentQuestion || {};
  const { questionImageTemplate, questionImageTemplateUrl, questionBackgroundColor } =
    questionPreferences || {};
  const backgroundStyle = questionImageTemplate
    ? {
        backgroundImage: `url(${questionImageTemplateUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : questionBackgroundColor
      ? { backgroundColor: questionBackgroundColor }
      : { backgroundColor: "white" };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {/* gap */}
      <div className="h-1" />

      <div className="flex min-h-screen w-full flex-col" style={backgroundStyle}>
        <div
          ref={scrollRef}
          style={{ touchAction: "pan-y", padding: isMobile ? "1px" : "2px" }}
          className="scrollbar-hidden flex flex-grow items-center justify-center overflow-x-hidden overflow-y-auto border-2 border-amber-500 pb-24 sm:p-1 sm:pb-20"
        >
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
              />
            </BehaviorTrackerProvider>
          </SlideMotion>
        </div>
      </div>

      <SurveyNavigatorCompact disableNext={!canProceed} navPulse={navPulse} />
    </div>
  );
};

export default SurveyScreenLayout;
