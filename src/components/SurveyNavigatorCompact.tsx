import { lazy, Suspense, useState } from "react";

import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import type { SurveyNavigatorCompactProps } from "@/types/surveyTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { useQuestionSubmit } from "@/context/QuestionNavigationContext";

const ReportSurveyModal = lazy(() =>
  import("./modal/ReportSurveyModal").then((module) => ({
    default: module.ReportSurveyModal,
  }))
);

const SurveyNavigatorCompact = ({
  disableNext,
  navPulse,
  shareID,
}: SurveyNavigatorCompactProps) => {
  const { canGoPrev, onPrev, goNext, isTerminal, currentQuestion } = useFlowRuntime();
  const { requestSubmit, hasSubmitHandler } = useQuestionSubmit();
  // const isEnd = currentQuestion.type === "END_SCREEN";
  const hideNext = isTerminal;
  const isWelcome = currentQuestion.type === "WELCOME_SCREEN";
  const mobileNextLabel = isWelcome ? "Start" : hasSubmitHandler ? "OK" : "Next";
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
      <div
        data-ignore-scrollnav="true"
        className="pointer-events-none relative z-[60] w-full shrink-0 border-t border-slate-200/70 bg-white/95 pt-2 backdrop-blur-sm md:fixed md:inset-x-0 md:bottom-0 md:h-16 md:border-0 md:bg-transparent md:pt-0 md:backdrop-blur-none"
      >
        <div className="relative flex min-h-16 w-full items-center justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)] md:h-full md:min-h-0 md:justify-end md:pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          {shareID && (
            <button
              type="button"
              onClick={handleOpenReportModal}
              className="pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-slate-500/70 transition hover:text-slate-700 md:top-auto md:bottom-6 md:left-6 md:translate-y-0"
            >
              Report
            </button>
          )}
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/70 p-1 shadow-md backdrop-blur-sm md:mr-[8%] md:mb-2">
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
                  className="h-11 min-w-11 rounded-full bg-[#005BC4] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#004a9f] disabled:opacity-40 md:w-11 md:bg-transparent md:px-2 md:text-gray-700 md:hover:bg-transparent md:hover:text-black"
                  disabled={disableNext && !hasSubmitHandler}
                  onClick={handleNext}
                  aria-label={
                    isWelcome ? "Start survey" : hasSubmitHandler ? "Submit response" : "Next"
                  }
                  variants={pulseVariant}
                  animate={navPulse === "next" ? "pulse" : "rest"}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <span className="md:hidden">{mobileNextLabel}</span>
                  <ChevronRight className="hidden h-7 w-7 md:block" />
                </motion.button>
              )
            }
          </div>
        </div>
      </div>
      {shareID && reportModalOpen && (
        <Suspense
          fallback={
            <div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/40 border-t-white" />
              <span className="sr-only">Loading…</span>
            </div>
          }
        >
          <ReportSurveyModal
            open={reportModalOpen}
            shareID={shareID}
            onClose={handleCloseReportModal}
          />
        </Suspense>
      )}
    </>
  );
};

export default SurveyNavigatorCompact;
