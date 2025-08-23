import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import InputResponse from "../questionresponse/InputResponse";

const EmailContactScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <div className="mx-auto flex w-full flex-col border-2 border-black">
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <PositionedBlock>
          <InputResponse
            inputPlaceholder={"Enter your email..."}
            submitButtonText={"Submit"}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            question={question}
          />
        </PositionedBlock>
      </CenteredStack>
    </div>
  );
};

export default EmailContactScreen;
