import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import type { SurveyNavigatorCompactProps } from "@/types/surveyTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const SurveyNavigatorCompact = ({ disableNext, navPulse }: SurveyNavigatorCompactProps) => {
  const { currentQuestion, canGoPrev, onPrev, goNext, isLastQuestion } = useFlowRuntime();
  const isEnd = currentQuestion.type === "END_SCREEN";
  const hideNext = isLastQuestion && !isEnd;

  const pulseVariant = {
    rest: { scale: 1, boxShadow: "0 0 0px rgba(37,99,235,0)" },
    pulse: { scale: 1.08, boxShadow: "0 0 14px rgba(37,99,235,0.45)" },
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] h-16">
      <div className="flex h-full w-full items-center justify-center pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:justify-end">
        <div className="pointer-events-auto mr-0 mb-2 flex items-center gap-2 rounded-full bg-white/70 p-1 shadow-md backdrop-blur-sm sm:mr-[8%]">
          {canGoPrev && (
            <motion.button
              className="h-11 w-11 rounded-full p-2 text-gray-700 transition hover:text-black"
              onClick={onPrev}
              aria-label="Previous"
              variants={pulseVariant}
              animate={navPulse === "prev" ? "pulse" : "rest"}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.button>
          )}

          {!isEnd && !hideNext && (
            <motion.button
              className="h-11 w-11 rounded-full p-2 text-gray-700 transition hover:text-black disabled:opacity-40"
              disabled={disableNext}
              onClick={goNext}
              aria-label="Next"
              variants={pulseVariant}
              animate={navPulse === "next" ? "pulse" : "rest"}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyNavigatorCompact;
