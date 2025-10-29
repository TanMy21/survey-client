import type { QuestionProps } from "@/types/questionTypes";

import QuestionTextandDescription from "../QuestionTextandDescription";

import CenteredStack from "../layout/CenteredStack";
import MultipleChoiceResponseContainer from "../QuestionResponse/MultipleChoiceResponseContainer";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const MultipleChoiceScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <MultipleChoiceResponseContainer question={question} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default MultipleChoiceScreen;
