import { BehaviorTrackerProvider } from "@/context/BehaviorTrackerContext";
import { SlideMotion } from "./motion/SlideMotion";
import QuestionRenderer from "./QuestionRenderer";
import { BacktrackLogger } from "./BacktrackLogger";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useMemo, useRef } from "react";
import { NON_FLOW_TYPES } from "@/types/flowTypes";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyNavigatorCompact from "./SurveyNavigatorCompact";
import { useScrollNav } from "@/hooks/useScrollNav";
import { useSwipeNav } from "@/hooks/useSwipeNav";

const SurveyScreenLayout = ({ surveyID }: SurveyContainerProps) => {
  const {
    currentQuestion,
    currentQuestionID,
    currentDisplayIndex,
    visitedStack,
    flowEligible,
    goNext,
    onPrev,
    canGoPrev,
  } = useFlowRuntime();
  const { canProceed } = useSurveyFlow();
  const isEnd = currentQuestion.type === "END_SCREEN";
  const scrollRef = useRef<HTMLDivElement>(null);

  const visitedRef = useRef<string[]>([]);
  const backtrackCountMapRef = useRef<Map<string, number>>(new Map());

  useScrollNav({
    container: scrollRef,
    goNext,
    goPrev: onPrev,
    canGoPrev,
    canGoNext: canProceed,
    isEnd,
    cooldownMs: 600,
    wheelThreshold: 100,
    touchThreshold: 48,
  });

  useSwipeNav({
    container: scrollRef,
    goNext,
    goPrev: onPrev,
    canGoPrev,
    canGoNext: canProceed,
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
      {/* Full-width progress bar at top */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Spacer div to prevent overlap due to fixed progress bar */}
      <div className="h-1" />
      <div className="flex min-h-screen w-full flex-col" style={backgroundStyle}>
        <div
          ref={scrollRef}
          style={{ touchAction: "pan-y" }}
          className="scrollbar-hidden flex flex-grow items-center justify-center overflow-x-hidden overflow-y-auto border-2 border-green-500"
        >
          <SlideMotion direction={"right"} keyProp={currentQuestionID}>
            <BehaviorTrackerProvider
              questionID={currentQuestionID}
              questionType={currentQuestion.type}
              backtrackCountMapRef={backtrackCountMapRef}
            >
              <BacktrackLogger questionID={currentQuestionID} visitedRef={visitedRef} />
              <QuestionRenderer
                question={currentQuestion}
                surveyID={surveyID}
                currentIndex={currentDisplayIndex!}
              />
            </BehaviorTrackerProvider>
          </SlideMotion>
        </div>

        <SurveyNavigatorCompact disableNext={!canProceed} />
      </div>
    </div>
  );
};

export default SurveyScreenLayout;
