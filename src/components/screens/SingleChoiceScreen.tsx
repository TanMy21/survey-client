import type { QuestionProps } from "@/types/questionTypes";

import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import SingleChoiceList from "../QuestionResponse/SingleChoiceList";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const SingleChoiceScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <SingleChoiceList question={question} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default SingleChoiceScreen;
