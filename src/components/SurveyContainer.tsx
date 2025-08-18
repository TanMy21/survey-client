import { useMemo, useRef, useState } from "react";
import SurveyNavigator from "./SurveyNavigator";
import QuestionRenderer from "./QuestionRenderer";
import type { SurveyContainerProps } from "@/types/survey";
import { useFetchSurvey } from "@/hooks/useSurvey";
import { SlideMotion } from "./motion/SlideMotion";
import { LogoLoader } from "./loader/LogoLoader";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { BehaviorTrackerProvider } from "@/context/BehaviorTrackerContext";
import { BacktrackLogger } from "./BacktrackLogger";

const SurveyContainer = ({ surveyID }: SurveyContainerProps) => {
  const { canProceed } = useSurveyFlow();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const visitedRef = useRef<string[]>([]);
  const backtrackCountMapRef = useRef<Map<string, number>>(new Map());
  const { data, isLoading, isError } = useFetchSurvey(surveyID);

  // useEffect(() => {
  //   if (surveyID) quizSessionStarted(surveyID);
  // }, [surveyID]);

  const questions = useMemo(() => {
    if (!data?.questions) return [];

    const sortedQuestions = [...data.questions].sort((a, b) => a.order! - b.order!);

    // Inject Consent screen
    const consentScreen = {
      questionID: "consent-screen",
      type: "CONSENT",
      order: -2,
    };

    const injected = [...sortedQuestions, consentScreen].sort((a, b) => a.order! - b.order!);

    return injected;
  }, [data]);

  // const sessions = data?.sessions ?? [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / (questions.length - 1)) * 100;

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
      ? {
          backgroundColor: questionBackgroundColor,
        }
      : {
          backgroundColor: "white",
        };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <LogoLoader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white p-4 text-center">
        <h1 className="text-xl text-red-500">Error loading survey. Please try again.</h1>
      </div>
    );
  }

  // if (isSessionCompleted(sessions)) {
  //   return (
  //     <div className="flex justify-center items-center h-screen p-4 text-center bg-white">
  //       <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
  //         You have already completed the survey.
  //       </h1>
  //     </div>
  //   );
  // }

  if (!questions.length) {
    return (
      <div className="flex h-screen w-full items-center justify-center">Error Loading Survey.</div>
    );
  }

  console.log("Survey ID:", surveyID);
  console.log("Data:", data);
  console.log("Current Question Index:", currentQuestionIndex);
  console.log("Total Questions:", questions.length);
  console.log("Current Question:", currentQuestion);
  console.log("Can Proceed:", canProceed);
  console.log("Q.type =", currentQuestion?.type);


  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* Full-width progress bar at top */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Spacer div to prevent overlap due to fixed progress bar */}
      <div className="h-1" />
      <div className="flex min-h-screen w-full flex-col" style={backgroundStyle}>
        {/* Scrollable area for questions only */}
        <div className="scrollbar-hidden flex flex-grow items-center justify-center overflow-x-hidden overflow-y-auto border-2 border-green-500">
          <SlideMotion direction={slideDirection} keyProp={currentQuestion.questionID}>
            <BehaviorTrackerProvider
              questionID={currentQuestion.questionID}
              questionType={currentQuestion.type}
              backtrackCountMapRef={backtrackCountMapRef}
            >
              <BacktrackLogger questionID={currentQuestion.questionID} visitedRef={visitedRef} />
              <QuestionRenderer
                question={currentQuestion}
                surveyID={surveyID}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
              />
            </BehaviorTrackerProvider>
          </SlideMotion>
        </div>

        <SurveyNavigator
          currentIndex={currentQuestionIndex}
          total={questions.length}
          disableNext={!canProceed}
          onNext={() => {
            console.log("Next question clicked");
            setSlideDirection("right");
            setCurrentQuestionIndex((i) => i + 1);
          }}
          onPrev={() => {
            setSlideDirection("left");
            setCurrentQuestionIndex((i) => i - 1);
          }}
        />
      </div>
    </div>
  );
};

export default SurveyContainer;
