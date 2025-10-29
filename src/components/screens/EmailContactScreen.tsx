import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import InputResponse from "../QuestionResponse/InputResponse";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const EmailContactScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <InputResponse
          inputPlaceholder={"Enter your email..."}
          submitButtonText={"OK"}
          question={question}
        />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default EmailContactScreen;
