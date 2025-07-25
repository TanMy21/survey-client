import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import InstructionsList from "../QuestionResponse/InstructionsList";

const InstructionScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { options } = question || {};
  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <div className="absolute bottom-[56%] z-2 my-[8%] mb-5 flex w-full flex-row items-end justify-center border-2 border-red-500 xl:bottom-[50%]">
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </div>
      <div className="absolute top-[44%] mx-auto flex h-[60%] w-full flex-col items-center justify-start border-2 border-red-500 xl:top-[50%]">
        <InstructionsList options={options!} />
        <div className="mt-4 flex w-3/5 justify-end pr-6">
          <button
            onClick={() => setCurrentQuestionIndex?.((i) => i + 1)}
            className="mr-8 min-w-[100px] rounded-[16px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionScreen;
