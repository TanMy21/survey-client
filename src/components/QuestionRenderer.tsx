import { Suspense } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionProps, QuestionTypeKey } from "@/types/questionTypes";
import { questionComponents } from "@/utils/questionConfig";

const QuestionRenderer = ({
  question,
  surveyID,
  currentIndex,
  completionTimeEstimate,
}: QuestionProps) => {
  const isMobile = useIsMobile();
  const Component = questionComponents[question?.type as QuestionTypeKey];
  return (
    <div
      className="mx-auto w-[92%] p-1 sm:w-[98%] sm:p-1 md:min-h-screen md:p-4"
      style={{ width: isMobile ? "98%" : "92%" }}
    >
      <Suspense
        fallback={
          <div
            className="flex min-h-[40vh] w-full items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <span className="sr-only">Loading question…</span>
          </div>
        }
      >
        <Component
          key={question?.questionID}
          question={question}
          surveyID={surveyID}
          currentIndex={currentIndex}
          completionTimeEstimate={completionTimeEstimate}
        />
      </Suspense>
    </div>
  );
};

export default QuestionRenderer;
