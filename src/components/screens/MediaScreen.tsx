import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import MediaOptionsContainer from "../questionresponse/MediaOptionsContainer";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import { ResponseContainer } from "../layout/ResponseContainer";

const MediaScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { options } = question ?? {};
  const multiSelect = true;

  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </PositionedBlock>
        <ResponseContainer>
          <MediaOptionsContainer
            options={options!}
            multiSelect={multiSelect}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            question={question}
          />
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default MediaScreen;
