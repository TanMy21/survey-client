import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";

const SingleChoiceScreen = ({ surveyID, question }: QuestionProps) => {
  return (
    <div className="relative flex flex-col mx-auto w-[98%] min-h-[700px] z-20 border-2 border-black-500">
      <div
        className="absolute bottom-[56%] xl:bottom-[50%] flex flex-row justify-center items-end
      w-full my-[8%] mb-5 z-2 border-2 border-red-500"
      >
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </div>
      <div
        className="absolute top-[44%] xl:top-[50%] flex flex-col justify-start items-center w-full
      h-[60%] mx-auto border-2 border-red-500"
      >
        <div className="origin-bottom flex flex-col border-2 border-purple-500"></div>
      </div>
    </div>
  );
};

export default SingleChoiceScreen;
