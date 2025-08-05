import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { MoveRight } from "lucide-react";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { PositionedBlock } from "../layout/PositionedBlock";
import CenteredStack from "../layout/CenteredStack";

const WelcomeScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { questionPreferences } = question || {};
  const { setCanProceed } = useSurveyFlow();
  setCanProceed(true);
  const buttonText = questionPreferences?.uiConfig?.buttonText || "Next";
  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>

        <PositionedBlock>
          <button
            onClick={() => setCurrentQuestionIndex?.((i) => i + 1)}
            className="flex min-w-[12%] items-center justify-center rounded-4xl bg-[#005BC4] px-3 py-2 text-base font-bold text-white transition duration-200 hover:bg-[#005BC4] md:px-6 md:py-4"
          >
            <span className="mr-2">{buttonText}</span>
            <MoveRight />
          </button>
        </PositionedBlock>
      </CenteredStack>
    </div>
  );
};

export default WelcomeScreen;
