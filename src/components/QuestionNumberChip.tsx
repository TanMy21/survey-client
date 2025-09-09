import type { QuestionNumberProps } from "@/types/questionTypes";

const QuestionNumberChip = ({ currentDisplayIndex }: QuestionNumberProps) => {
  return (
    <div className="md:self-start">
      <span
        className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xl font-medium text-blue-700"
        aria-label={`Question ${currentDisplayIndex}`}
      >
        Q{currentDisplayIndex}
      </span>
    </div>
  );
};

export default QuestionNumberChip;
