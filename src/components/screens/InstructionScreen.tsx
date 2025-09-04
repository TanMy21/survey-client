import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import InstructionsList from "../questionresponse/InstructionsList";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const InstructionScreen = ({ surveyID, question }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();
  const { options } = question || {};
  setCanProceed(true);

  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <InstructionsList options={options!} />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default InstructionScreen;
