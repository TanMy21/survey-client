import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { QuestionProps } from "@/types/questionTypes";
import { Clock3, MoveRight } from "lucide-react";
import { useEffect } from "react";
import CenteredStack from "../layout/CenteredStack";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";
import { WelcomeScreenTextandDescription } from "../WelcomeScreenTextandDescription";

const WelcomeScreen = ({ surveyID, question, completionTimeEstimate }: QuestionProps) => {
  const { questionPreferences } = question || {};
  const { setCanProceed } = useSurveyFlow();
  const { goNext } = useFlowRuntime();

  const { handleFirstInteraction, handleClick, markSubmission, markAnsweredEvent } = useBehavior();

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  const buttonText = questionPreferences?.uiConfig?.buttonText || "Next";

  const estimatedMinutes = completionTimeEstimate?.estimatedCompletionTimeMinutes;

  const completionTimeLabel =
    estimatedMinutes && estimatedMinutes > 1
      ? `${estimatedMinutes} minutes`
      : estimatedMinutes === 1
        ? "1 minute"
        : null;

  const handleNext = async () => {
    handleFirstInteraction();
    handleClick();
    markSubmission();
    markAnsweredEvent();
    goNext();
  };

  return (
    <ScreenRoot>
      <CenteredStack>
        <WelcomeScreenTextandDescription surveyID={surveyID} question={question} />
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

        {completionTimeLabel && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1.5 text-xl font-medium text-slate-400">
              <Clock3 className="h-6 w-6 text-slate-400" />
              <span>
                Takes just{" "}
                <span className="font-semibold text-slate-500">{completionTimeLabel}</span>
              </span>
            </div>
          </div>
        )}
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default WelcomeScreen;
