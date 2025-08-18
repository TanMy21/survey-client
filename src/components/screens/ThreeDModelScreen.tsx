import { useIsMobile } from "@/hooks/useIsMobile";
import ThreeDViewer from "../questionresponse/ThreeDViewer";
import ThreeDMobileViewer from "../questionresponse/ThreeDMobileViewer";
import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";

const ThreeDModelScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const isMobile = useIsMobile();

  const url = question?.Model3D?.fileUrl;
  const showQuestion = question?.Model3D?.showQuestion;

  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      {/* Question Section */}
      <div className="flex w-[98%] gap-4 p-2">
        {showQuestion && (
          <div className="flex h-[98%] w-[96%] p-1">
            <QuestionTextandDescription surveyID={surveyID} question={question} />
          </div>
        )}
      </div>
      {isMobile ? <ThreeDMobileViewer url={url!} /> : <ThreeDViewer url={url!} />}
    </div>
  );
};

export default ThreeDModelScreen;
