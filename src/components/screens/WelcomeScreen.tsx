import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { QuestionProps } from "@/types/questionTypes";
import { MoveRight } from "lucide-react";
import { useEffect } from "react";
import CenteredStack from "../layout/CenteredStack";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const WelcomeScreen = ({ surveyID, question }: QuestionProps) => {
  const { questionPreferences } = question || {};
  const { setCanProceed } = useSurveyFlow();
  const { goNext } = useFlowRuntime();
  const { handleFirstInteraction, handleClick, markSubmission, collectBehaviorData } =
    useBehavior();

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  const buttonText = questionPreferences?.uiConfig?.buttonText || "Next";

  const handleNext = () => {
    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 WelcomeScreen behavior data:", data);
    handleFirstInteraction();
    handleClick();
    goNext();
  };

  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <button
          onClick={handleNext}
          className="group flex items-center justify-center gap-2 rounded-full bg-[#005BC4] px-6 py-3 text-lg font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#004aa0] focus:ring-2 focus:ring-[#005BC4] focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
        >
          <span className="transition-all duration-300 ease-in-out group-hover:mr-1">
            {buttonText}
          </span>

          <div className="w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:w-6 group-hover:opacity-100">
            <MoveRight className="h-6 w-6" />
          </div>
        </button>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default WelcomeScreen;
