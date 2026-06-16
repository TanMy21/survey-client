import type { QuestionProps } from "@/types/questionTypes";
import CenteredStack from "../layout/CenteredStack";
import { ResponseContainer } from "../layout/ResponseContainer";
import ScreenRoot from "../layout/ScreenRoot";
import QuestionTextandDescription from "../QuestionTextandDescription";
import ConceptFitResponse from "../QuestionResponse/ConceptFitResponse";

const ConceptFitScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>

      <ResponseContainer>
        <ConceptFitResponse
          question={question!}
          surveyID={surveyID!}
        />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default ConceptFitScreen;
