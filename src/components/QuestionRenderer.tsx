import type { QuestionProps, QuestionTypeKey } from "@/types/question";
import { questionComponents } from "@/utils/questionConfig";

const QuestionRenderer = ({ question, surveyID, setCurrentQuestionIndex }: QuestionProps) => {
  const Component = questionComponents[question?.type as QuestionTypeKey];
  return (
    <div className="mx-auto h-full p-4 border-2 border-blue-500" style={{ width: "92%" }}>
      <Component
        question={question}
        surveyID={surveyID}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default QuestionRenderer;
