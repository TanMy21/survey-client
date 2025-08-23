import type { QuestionProps } from "@/types/questionTypes";

import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import SingleChoiceList from "../questionresponse/SingleChoiceList";

const SingleChoiceScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  return (
    <div className="border-black-500 z-20 mx-auto flex w-[98%] flex-col border-2">
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <PositionedBlock>
          <SingleChoiceList question={question} setCurrentQuestionIndex={setCurrentQuestionIndex} />
        </PositionedBlock>
      </CenteredStack>
    </div>
  );
};

export default SingleChoiceScreen;
