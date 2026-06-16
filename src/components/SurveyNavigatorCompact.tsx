import { useState } from "react";

import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import type { SurveyNavigatorCompactProps } from "@/types/surveyTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ReportSurveyModal } from "./modal/ReportSurveyModal";
import { useQuestionSubmit } from "@/context/QuestionNavigationContext";

const SurveyNavigatorCompact = ({
  disableNext,
  navPulse,
  shareID,
}: SurveyNavigatorCompactProps) => {
  const { currentQuestion, canGoPrev, onPrev, goNext, isTerminal } = useFlowRuntime();
  const { requestSubmit, hasSubmitHandler } = useQuestionSubmit();
  const isEnd = currentQuestion.type === "END_SCREEN";
  const hideNext = isTerminal;
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const handleNext = () => {
    if (hasSubmitHandler) {
      requestSubmit();
      return;
    }

    goNext();
  };

  const pulseVariant = {
    rest: { scale: 1, boxShadow: "0 0 0px rgba(37,99,235,0)" },
    pulse: { scale: 1.08, boxShadow: "0 0 14px rgba(37,99,235,0.45)" },
  };

  const handleOpenReportModal = () => {
    setReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setReportModalOpen(false);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] h-16">
        <div className="flex h-full w-full items-center justify-center pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:justify-end">
          {shareID && (
            <button
              type="button"
              onClick={handleOpenReportModal}
              className="pointer-events-auto absolute bottom-5 left-4 text-sm font-medium text-slate-500/70 transition hover:text-slate-700 sm:bottom-6 sm:left-6"
            >
              Report
            </button>
          )}
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

            {
              // !isEnd &&
              !hideNext && (
                <motion.button
                  className="h-11 w-11 rounded-full p-2 text-gray-700 transition hover:text-black disabled:opacity-40"
                  disabled={disableNext && !hasSubmitHandler}
                  onClick={handleNext}
                  aria-label="Next"
                  variants={pulseVariant}
                  animate={navPulse === "next" ? "pulse" : "rest"}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.button>
              )
            }
          </div>
        </div>
      </div>
      {shareID && (
        <ReportSurveyModal
          open={reportModalOpen}
          shareID={shareID}
          onClose={handleCloseReportModal}
        />
      )}
    </>
  );
};

export default SurveyNavigatorCompact;
