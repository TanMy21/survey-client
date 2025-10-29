import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import RangeResponse from "../QuestionResponse/RangeResponse";
import CenteredStack from "../layout/CenteredStack";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const RangeScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <RangeResponse question={question!} setCurrentQuestionIndex={setCurrentQuestionIndex} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default RangeScreen;
