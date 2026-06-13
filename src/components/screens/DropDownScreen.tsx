import type { QuestionProps } from "@/types/questionTypes";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { ResponseContainer } from "../layout/ResponseContainer";
import DropDownResponse from "../QuestionResponse/DropdownResponse";

const DropDownScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <DropDownResponse question={question} surveyID={surveyID!} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default DropDownScreen;
