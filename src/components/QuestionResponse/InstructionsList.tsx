import type { ResponseListProps } from "@/types/responseTypes";
import InstructionsListItem from "./InstructionsListItem";

const InstructionsList = ({ options, setCurrentQuestionIndex }: ResponseListProps) => {
  return (
    <div className="flex w-[60%] origin-bottom flex-col">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2">
        <div className="mx-auto flex w-[96%] flex-col items-center gap-2 p-1 md:w-full">
          {options?.map((option, index) => (
            <InstructionsListItem key={option.optionID} response={option} index={index} />
          ))}
        </div>
        <div className="mt-4 flex w-full justify-end border-2 border-red-600 pr-6">
          <button
            onClick={() => setCurrentQuestionIndex?.((i) => i + 1)}
            className="mr-2 min-w-[100px] rounded-[16px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsList;
