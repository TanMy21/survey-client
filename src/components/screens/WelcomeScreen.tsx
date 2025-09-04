import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { QuestionProps } from "@/types/questionTypes";
import { MoveRight } from "lucide-react";
import { useEffect } from "react";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
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
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <button
            onClick={handleNext}
            className="tall:px-8 tall:py-5 tall:text-2xl flex min-w-[12%] items-center justify-center gap-2 rounded-4xl bg-[#005BC4] px-3 py-2 text-base font-bold text-white transition duration-200 hover:bg-[#005BC4] md:px-6 md:py-4"
          >
            <span className="mr-2">{buttonText}</span>
            <MoveRight style={{ marginTop: "6%" }} />
          </button>
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default WelcomeScreen;
