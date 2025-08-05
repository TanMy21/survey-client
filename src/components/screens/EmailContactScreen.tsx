import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import InputResponse from "../questionresponse/InputResponse";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";

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
