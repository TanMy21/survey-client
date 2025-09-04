import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import InputResponseNumber from "../questionresponse/InputResponseNumber";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const NumberScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <InputResponseNumber
            inputPlaceholder={"Enter your response..."}
            submitButtonText={"OK"}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            question={question}
          />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default NumberScreen;
