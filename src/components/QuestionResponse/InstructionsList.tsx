import type { ResponseListProps } from "@/types/response";
import InstructionsListItem from "./InstructionsListItem";

const InstructionsList = ({ options }: ResponseListProps) => {
  return (
    <div className="flex w-[60%] origin-bottom flex-col">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2">
        <div className="mx-auto flex w-[96%] flex-col items-center gap-2 p-1 md:w-full">
          {options?.map((option, index) => (
            <InstructionsListItem key={option.optionID} response={option} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionsList;
