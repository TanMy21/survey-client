import type { QuestionProps } from "@/types/questionTypes";
import QuestionTextandDescription from "../QuestionTextandDescription";
import CenteredStack from "../layout/CenteredStack";
import InputResponse from "../QuestionResponse/InputResponse";
import ScreenRoot from "../layout/ScreenRoot";
import { ResponseContainer } from "../layout/ResponseContainer";

const EmailContactScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <ScreenRoot className="min-h-[calc(100dvh-5.5rem)] md:min-h-screen">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <CenteredStack className="!mb-0" marginTopOverride="0">
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </CenteredStack>
        <ResponseContainer className="!mt-0 !mb-0">
          <InputResponse
            inputPlaceholder={"Enter your email..."}
            submitButtonText={"OK"}
            question={question}
            surveyID={surveyID}
          />
        </ResponseContainer>
      </div>
    </ScreenRoot>
  );
};

export default EmailContactScreen;
