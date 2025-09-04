import type { QuestionProps } from "@/types/questionTypes";

import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import SingleChoiceList from "../questionresponse/SingleChoiceList";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const SingleChoiceScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <SingleChoiceList question={question} />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default SingleChoiceScreen;
