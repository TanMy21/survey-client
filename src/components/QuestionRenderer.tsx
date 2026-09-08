import { Suspense } from "react";

import type { QuestionProps, QuestionTypeKey } from "@/types/questionTypes";
import { questionComponents } from "@/utils/questionConfig";

const QuestionRenderer = ({
  question,
  surveyID,
  currentIndex,
  completionTimeEstimate,
}: QuestionProps) => {
  const Component = questionComponents[question?.type as QuestionTypeKey];
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
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
