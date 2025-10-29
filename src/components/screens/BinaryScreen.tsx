import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import BinaryResponseContainer from "../QuestionResponse/BinaryResponseContainer";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const BinaryScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <BinaryResponseContainer question={question!} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default BinaryScreen;
