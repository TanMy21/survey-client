import type { QuestionProps, QuestionTypeKey } from "@/types/question";
import { questionComponents } from "@/utils/questionConfig";

const QuestionRenderer = ({ question, surveyID, setCurrentQuestionIndex }: QuestionProps) => {
  const Component = questionComponents[question.type as QuestionTypeKey];
  return (
    <div className="w-full h-full p-4">
      <Component
        question={question}
        surveyID={surveyID}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default QuestionRenderer;
