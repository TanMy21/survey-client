import type { QuestionProps, QuestionTypeKey } from "@/types/questionTypes";
import { questionComponents } from "@/utils/questionConfig";

const QuestionRenderer = ({ question, surveyID, currentIndex }: QuestionProps) => {
  const Component = questionComponents[question?.type as QuestionTypeKey];
  return (
    <div className="mx-auto min-h-screen w-[92%] border-2 border-blue-500 p-1 sm:p-3 md:p-4">
      <Component question={question} surveyID={surveyID} currentIndex={currentIndex} />
    </div>
  );
};

export default QuestionRenderer;
