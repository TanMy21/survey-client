import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import InputResponse from "../questionresponse/InputResponse";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const EmailContactScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <InputResponse
            inputPlaceholder={"Enter your email..."}
            submitButtonText={"OK"}
            question={question}
          />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default EmailContactScreen;
