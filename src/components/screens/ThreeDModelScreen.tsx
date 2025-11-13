import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionProps } from "@/types/questionTypes";
import ThreeDMobileViewer from "../QuestionResponse/ThreeDMobileViewer";
import ThreeDViewer from "../QuestionResponse/ThreeDViewer";
import QuestionTextandDescription from "../QuestionTextandDescription";

const ThreeDModelScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const isMobile = useIsMobile();

  const url = question?.Model3D?.fileUrl;
  const showQuestion = question?.Model3D?.showQuestion;

  return (
    <div className="relative z-20 mx-auto flex w-full flex-col items-center justify-center sm:w-[98%] md:min-h-[700px]">
      {/* Question Section */}
      <div className="w-sm:mt-[-2%] max-sm:scrollbar-hidden max-sm:fade-bottom tabp-s:w-[98%] tabp-m:w-[98%] tabp-l:w-[98%] mt-[2%] flex w-full gap-4 overflow-y-auto overscroll-none p-2 max-sm:max-h-[28vh] max-sm:overflow-y-auto max-sm:overscroll-contain sm:w-[80%]">
        {showQuestion && (
          <div className="tabp-s:w-full tabp-m:w-full tabp-l:w-full flex h-[98%] w-full p-1 sm:w-[96%]">
            <QuestionTextandDescription surveyID={surveyID} question={question} />
          </div>
        )}
      </div>
      {isMobile ? (
        <ThreeDMobileViewer
          surveyID={surveyID!}
          url={url!}
          question={question!}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      ) : (
        <ThreeDViewer
          surveyID={surveyID!}
          url={url!}
          question={question!}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      )}
    </div>
  );
};

export default ThreeDModelScreen;
