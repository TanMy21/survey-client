import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import RankList from "../QuestionResponse/RankList";

const RankScreen = ({ surveyID, question }: QuestionProps) => {
  const { options } = question || {};
  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <div className="absolute bottom-[56%] z-2 my-[8%] mb-5 flex w-full flex-row items-end justify-center border-2 border-red-500 xl:bottom-[50%]">
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </div>
      <div className="absolute top-[44%] mx-auto flex h-[60%] w-full flex-col items-center justify-start border-2 border-red-500 xl:top-[50%]">
        <RankList options={options!} />
      </div>
    </div>
  );
};

export default RankScreen;
