import type { SurveyNavigatorProps } from "@/types/survey";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SurveyNavigator = ({ currentIndex, total, onNext, onPrev }: SurveyNavigatorProps) => {
  return (
    <div className="flex justify-end items-center h-16 px-4 gap-4 border-2 border-red-500">
      {currentIndex > 0 && (
        <button className="p-2 text-gray-700 hover:text-black transition" onClick={onPrev}>
          <ChevronLeft />
        </button>
      )}
      {currentIndex < total - 1 && (
        <button className="p-2 text-gray-700 hover:text-black transition" onClick={onNext}>
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default SurveyNavigator;
