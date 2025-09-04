import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import InputResponseText from "../questionresponse/InputResponseText";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const TextScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <InputResponseText
            inputPlaceholder={"Enter your response..."}
            submitButtonText={"OK"}
            question={question}
          />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default TextScreen;
