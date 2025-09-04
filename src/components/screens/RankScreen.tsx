import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import RankList from "../questionresponse/RankList";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const RankScreen = ({ surveyID, question }: QuestionProps) => {
  const { options } = question || {};

  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <RankList options={options!} />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default RankScreen;
