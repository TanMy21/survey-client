import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import InputResponseNumber from "../QuestionResponse/InputResponseNumber";
import CenteredStack from "../layout/CenteredStack";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const NumberScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <InputResponseNumber
          surveyID={surveyID!}
          inputPlaceholder={"Enter your response..."}
          submitButtonText={"OK"}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          question={question}
        />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default NumberScreen;
