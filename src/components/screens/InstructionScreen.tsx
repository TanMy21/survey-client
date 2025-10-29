import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import InstructionsList from "../QuestionResponse/InstructionsList";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const InstructionScreen = ({ surveyID, question }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();
  const { options } = question || {};
  setCanProceed(true);

  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <InstructionsList options={options!} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default InstructionScreen;
