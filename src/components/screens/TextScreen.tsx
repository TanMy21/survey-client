import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import InputResponseText from "../QuestionResponse/InputResponseText";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";
import QuestionImageContainer from "../screen-components/QuestionImageContainer";

const TextScreen = ({ surveyID, question }: QuestionProps) => {
  const {
    questionImage,
    questionImageWidth,
    questionImageHeight,
    questionImageUrl,
    questionImageAltTxt,
  } = question || {};

  return (
    <ScreenRoot>
      {/* Image container */}
      {questionImage && (
        <div className="flex max-h-[360px] w-full items-center justify-center px-2 py-1 xl:mt-[1%] xl:mb-1">
          <QuestionImageContainer
            questionImageHeight={questionImageHeight}
            questionImageWidth={questionImageWidth}
            questionImageUrl={questionImageUrl}
            questionImageAltText={questionImageAltTxt}
          />
        </div>
      )}
      <CenteredStack marginTopOverride="-1%">
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>
      <ResponseContainer>
        <InputResponseText
          surveyID={surveyID!}
          inputPlaceholder={"Enter your response..."}
          submitButtonText={"OK"}
          question={question}
        />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default TextScreen;
