import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import InputResponseText from "../questionresponse/InputResponseText";

const TextScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>

        <PositionedBlock>
          <InputResponseText
            inputPlaceholder={"Enter your response..."}
            submitButtonText={"Submit"}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            question={question}
          />
        </PositionedBlock>
      </CenteredStack>
    </div>
  );
};

export default TextScreen;
