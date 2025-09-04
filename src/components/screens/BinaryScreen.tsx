import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import BinaryResponseContainer from "../questionresponse/BinaryResponseContainer";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const BinaryScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <BinaryResponseContainer
            question={question!}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default BinaryScreen;
