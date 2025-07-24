import { useEffect, useMemo, useState } from "react";
import SurveyNavigator from "./SurveyNavigator";
import type { Question } from "@/types/question";
import type { Session } from "@/types/session";
import QuestionRenderer from "./QuestionRenderer";
import type { SurveyContainerProps } from "@/types/survey";
import { useFetchSurvey } from "@/hooks/useSurvey";
import { SlideMotion } from "./motion/SlideMotion";

const SurveyContainer = ({ surveyID }: SurveyContainerProps) => {
  // const [questions, setQuestions] = useState<Question[]>([]);
  // const [sessions, setSessions] = useState<Session[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  const { data, isLoading, isError } = useFetchSurvey(surveyID);

  // useEffect(() => {
  //   if (surveyID) quizSessionStarted(surveyID);
  // }, [surveyID]);

  const questions = useMemo(() => {
    if (!data?.questions) return [];
    return [...data.questions].sort((a, b) => a.order! - b.order!);
  }, [data]);

  // const sessions = data?.sessions ?? [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / (questions.length - 1)) * 100;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse h-1 w-1/2 bg-gray-400" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-screen p-4 text-center bg-white">
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

  console.log("Current Question :", currentQuestion);

  if (!questions.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse h-1 w-1/2 bg-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white">
      {/* Full-width progress bar at top */}
      <div className="w-full h-1 bg-gray-200 fixed top-0 left-0 z-50">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Spacer div to prevent overlap due to fixed progress bar */}
      <div className="h-1" />

      {/* Scrollable area for questions only */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hidden border-2 border-green-500">
        <SlideMotion direction={slideDirection} keyProp={currentQuestion.questionID}>
          <QuestionRenderer
            question={currentQuestion}
            surveyID={surveyID}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        </SlideMotion>
      </div>

      {/* Navigator stays visible and fixed in layout */}
      <SurveyNavigator
        currentIndex={currentQuestionIndex}
        total={questions.length}
        onNext={() => {
          setSlideDirection("right");
          setCurrentQuestionIndex((i) => i + 1);
        }}
        onPrev={() => {
          setSlideDirection("left");
          setCurrentQuestionIndex((i) => i - 1);
        }}
      />
    </div>
  );
};

export default SurveyContainer;
