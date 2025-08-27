import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import type { SurveyNavigatorCompactProps } from "@/types/surveyTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SurveyNavigatorCompact = ({ disableNext }: SurveyNavigatorCompactProps) => {
  const { currentQuestion, canGoPrev, onPrev, goNext } = useFlowRuntime();
  const isEnd = currentQuestion.type === "END_SCREEN";

  return (
    <div className="flex h-16 items-center justify-end gap-4 px-4">
      {canGoPrev && (
        <button
          className="p-2 text-gray-700 transition hover:text-black"
          onClick={onPrev}
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
      )}
      {/* The Next button is not needed here; questions call onSubmitAnswer themselves.
          For END_SCREEN you might show a "Finish" button inside that component. */}
      {!isEnd && (
        <button
          className="p-2 text-gray-700 transition hover:text-black disabled:opacity-40"
          disabled={disableNext}
          onClick={goNext}
          // onClick intentionally omitted; answers trigger navigation via onSubmitAnswer in each question
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default SurveyNavigatorCompact;
