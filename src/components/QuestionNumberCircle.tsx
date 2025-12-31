import type { QuestionNumberProps } from "@/types/questionTypes";

const QuestionNumberCircle = ({
  circleSize,
  currentDisplayIndex,
  orderFontSize,
}: QuestionNumberProps) => {
  return (
    <div className="flex h-[98%] w-[24%] items-center justify-center sm:w-[6%] border-2 border-violet-600 shrink-0">
      <div
        className="mt-1 mr-2 flex items-center justify-center rounded-full"
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: "#0074EB",
        }}
      >
        <p className="font-bold text-white" style={{ fontSize: orderFontSize || 20 }}>
          {currentDisplayIndex}
        </p>
      </div>
    </div>
  );
};

export default QuestionNumberCircle;
