import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import InstructionsList from "../questionresponse/InstructionsList";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";

const InstructionScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();
  const { options } = question || {};
  setCanProceed(true);

  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>

        <PositionedBlock>
          <InstructionsList options={options!} setCurrentQuestionIndex={setCurrentQuestionIndex} />
        </PositionedBlock>
      </CenteredStack>
    </div>
  );
};

export default InstructionScreen;
