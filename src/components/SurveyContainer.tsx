import { useEffect, useState } from "react";
import SurveyNavigator from "./SurveyNavigator";
import type { Question } from "@/types/question";
import type { Session } from "@/types/session";
import QuestionRenderer from "./QuestionRenderer";
import type { SurveyContainerProps } from "@/types/survey";

const SurveyContainer = ({surveyID}:SurveyContainerProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / (questions.length - 1)) * 100;

  //   useEffect(() => {
  //     const loadData = async () => {
  //       try {
  //         const data = await fetchSurvey(surveyID);
  //         const sorted = data.questions.sort((a, b) => a.order! - b.order!);
  //         setQuestions(sorted);
  //         setSessions(data.sessions);
  //       } catch (err) {
  //         console.error("Survey fetch failed", err);
  //       }
  //     };
  //     loadData();
  //     quizSessionStarted(surveyID);
  //   }, [surveyID]);

  //   if (isSessionCompleted(sessions)) {
  //     return (
  //       <div className="flex justify-center items-center h-screen p-4 text-center">
  //         <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
  //           You have already completed the survey.
  //         </h1>
  //       </div>
  //     );
  //   }

  if (!questions.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse h-1 w-1/2 bg-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow overflow-auto">
        <QuestionRenderer
          question={currentQuestion}
          surveyID={surveyID}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      </div>

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
