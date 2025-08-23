import type { SurveyNavigatorProps } from "@/types/surveyTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SurveyNavigator = ({
  currentIndex,
  total,
  disableNext,
  onNext,
  onPrev,
}: SurveyNavigatorProps) => {
  return (
    <div className="flex h-16 items-center justify-end gap-4 border-2 border-red-500 px-4">
      {currentIndex > 0 && (
        <button className="p-2 text-gray-700 transition hover:text-black" onClick={onPrev}>
          <ChevronLeft />
        </button>
      )}
      {currentIndex < total - 1 && (
        <button
          className="p-2 text-gray-700 transition hover:text-black"
          disabled={disableNext || currentIndex === total - 1}
          onClick={onNext}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default SurveyNavigator;
