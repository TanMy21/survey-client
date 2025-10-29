import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import MediaOptionsContainer from "../QuestionResponse/MediaOptionsContainer";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import { ResponseContainer } from "../layout/ResponseContainer";

const MediaScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { options } = question ?? {};
  const multiSelect = true;

  return (
    <ScreenRoot>
      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>

      <ResponseContainer>
        <MediaOptionsContainer
          options={options!}
          multiSelect={multiSelect}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          question={question}
        />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default MediaScreen;
