import type { QuestionNumberProps } from "@/types/questionTypes";

const QuestionNumberChip = ({ currentDisplayIndex }: QuestionNumberProps) => {
  return (
    <div className="self-center">
      <span
        className="inline-flex h-7 w-7 min-w-7 items-center justify-center rounded-full bg-[#0074EB] text-sm font-bold text-white"
        aria-label={`Question ${currentDisplayIndex}`}
      >
        {currentDisplayIndex}
      </span>
    </div>
  );
};

export default QuestionNumberChip;
