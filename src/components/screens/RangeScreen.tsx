import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import RangeResponse from "../questionresponse/RangeResponse";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const RangeScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <RangeResponse question={question!} setCurrentQuestionIndex={setCurrentQuestionIndex} />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default RangeScreen;
