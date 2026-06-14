import type { QuestionProps } from "@/types/questionTypes";
import CenteredStack from "../layout/CenteredStack";
import { ResponseContainer } from "../layout/ResponseContainer";
import ScreenRoot from "../layout/ScreenRoot";
import QuestionTextandDescription from "../QuestionTextandDescription";
import IATResponse from "../QuestionResponse/IATResponse";

const IATScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>

      <ResponseContainer>
        <IATResponse question={question!} surveyID={surveyID!} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default IATScreen;
