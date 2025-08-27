import { BehaviorTrackerProvider } from "@/context/BehaviorTrackerContext";
import { SlideMotion } from "./motion/SlideMotion";
import QuestionRenderer from "./QuestionRenderer";
import { BacktrackLogger } from "./BacktrackLogger";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useMemo, useRef, useState } from "react";
import { NON_FLOW_TYPES } from "@/types/flowTypes";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyNavigatorCompact from "./SurveyNavigatorCompact";
import { QuestionSubmitProvider } from "@/context/QuestionNavigationContext";

const SurveyScreenLayout = ({ surveyID }: SurveyContainerProps) => {
  const { currentQuestion, currentQuestionID, currentDisplayIndex, visitedStack, flowEligible } =
    useFlowRuntime();
  const { canProceed } = useSurveyFlow(); // your existing canProceed gate
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentDisplayIndex);
  //   const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const visitedRef = useRef<string[]>([]);
  const backtrackCountMapRef = useRef<Map<string, number>>(new Map());

  // useEffect(() => {
  //   if (surveyID) quizSessionStarted(surveyID);
  // }, [surveyID]);

  //   const questions = useMemo(() => {
  //     if (!data?.questions) return [];

  //     const sortedQuestions = [...data.questions].sort((a, b) => a.order! - b.order!);

  //     // Inject Consent screen
  //     const consentScreen = {
  //       questionID: "consent-screen",
  //       type: "CONSENT",
  //       order: -2,
  //     };

  //     const injected = [...sortedQuestions, consentScreen].sort((a, b) => a.order! - b.order!);

  //     return injected;
  //   }, [data]);

  // const sessions = data?.sessions ?? [];

  //   usePreloadNeighbors(questions, currentQuestionIndex, 1);

  //   const { questionPreferences } = currentQuestion || {};
  //   const { questionImageTemplate, questionImageTemplateUrl, questionBackgroundColor } =
  // questionPreferences || {};

  //   const backgroundStyle = questionImageTemplate
  //     ? {
  //         backgroundImage: `url(${questionImageTemplateUrl})`,
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //       }
  //     : questionBackgroundColor
  //       ? {
  //           backgroundColor: questionBackgroundColor,
  //         }
  //       : {
  //           backgroundColor: "white",
  //         };

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

  //   console.log("Data from be: ", data);

  //   const total = questions.length;
  //   const currentQuestion = questions[currentQuestionIndex];
  //   const progress = total > 1 ? (currentQuestionIndex / (questions.length - 1)) * 100 : 0;

  // progress: show proportion of visited vs total flow-eligible (excluding non-questions)
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

  // background styling logic can remain as you had it; pulling from currentQ.questionPreferences
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
        {/* Scrollable area for questions only */}
        {/* <QuestionSubmitProvider> */}
        <div className="scrollbar-hidden flex flex-grow items-center justify-center overflow-x-hidden overflow-y-auto border-2 border-green-500">
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
                // setCurrentQuestionIndex={setCurrentQuestionIndex}
              />
            </BehaviorTrackerProvider>
          </SlideMotion>
        </div>

        <SurveyNavigatorCompact disableNext={!canProceed} />

        {/* <SurveyNavigator
          currentIndex={currentQuestionIndex}
          total={totalCount}
          disableNext={!canProceed}
          onNext={() => {
            setSlideDirection("right");
            setCurrentQuestionIndex((i) => {
              const nextIndex = Math.min(i + 1, totalCount - 1);

              const nextNext = questions[nextIndex + 1];
              if (nextNext?.Model3D?.fileUrl) {
                warmGLTF(nextNext.Model3D.fileUrl);
              }

              return nextIndex;
            });
          }}
          onPrev={() => {
            setSlideDirection("left");
            setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
          }}
        /> */}
        {/* </QuestionSubmitProvider> */}
      </div>
    </div>
  );
};

export default SurveyScreenLayout;
