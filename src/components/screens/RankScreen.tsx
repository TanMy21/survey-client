import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import RankList from "../QuestionResponse/RankList";
import CenteredStack from "../layout/CenteredStack";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const RankScreen = ({ surveyID, question }: QuestionProps) => {
  const { options } = question || {};

  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <RankList options={options!} question={question}/>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default RankScreen;
