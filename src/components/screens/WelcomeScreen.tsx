import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { MoveRight } from "lucide-react";
import { useSurveyFlow } from "@/context/useSurveyFlow";

const WelcomeScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { questionPreferences } = question || {};
  const { setCanProceed } = useSurveyFlow();
  setCanProceed(true);
  const buttonText = questionPreferences?.uiConfig?.buttonText || "Next";
  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <div className="absolute bottom-[56%] z-2 my-[8%] mb-5 flex w-full flex-row items-end justify-center border-2 border-red-500 xl:bottom-[50%]">
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </div>
      <div className="absolute top-[44%] mx-auto flex h-[60%] w-full flex-col items-center justify-start border-2 border-red-500 xl:top-[50%]">
        <button
          onClick={() => setCurrentQuestionIndex?.((i) => i + 1)}
          className="flex items-center justify-center rounded-4xl bg-[#005BC4] px-3 py-2 text-base font-bold text-white transition duration-200 hover:bg-[#005BC4] md:px-6 md:py-4"
        >
          <span className="mr-2">{buttonText}</span>
          <MoveRight />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
