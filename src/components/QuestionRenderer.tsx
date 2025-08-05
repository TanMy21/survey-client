import type { QuestionProps, QuestionTypeKey } from "@/types/question";
import { questionComponents } from "@/utils/questionConfig";

const QuestionRenderer = ({ question, surveyID, setCurrentQuestionIndex }: QuestionProps) => {
  const Component = questionComponents[question?.type as QuestionTypeKey];
  return (
    <div className="mx-auto min-h-screen w-[92%] border-2 border-blue-500 p-4">
      <Component
        question={question}
        surveyID={surveyID}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default QuestionRenderer;
