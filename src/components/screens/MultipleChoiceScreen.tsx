import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { QuestionProps } from "@/types/questionTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { InputError } from "../alert/ResponseErrorAlert";
import MultipleChoiceList from "../questionresponse/MultipleChoiceList";

const MultipleChoiceScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { options } = question || {};
  const isRequired = useQuestionRequired(question);
  const [selectedOptions, setSelectedOptions] = useState<{ optionID: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefMap = useRef<Record<string, HTMLDivElement | null>>({});
  const lastChangedIDRef = useRef<string | null>(null);

  const {
    handleFirstInteraction,
    handleOptionChange,
    handleClick,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleOptionToggle = (optionID: string, value: string) => {
    handleFirstInteraction();
    handleOptionChange();
    handleClick();

    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.optionID === optionID);
      const next = exists
        ? prev.filter((o) => o.optionID !== optionID)
        : [...prev, { optionID, value }];
      lastChangedIDRef.current = optionID;
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    if (isRequired && selectedOptions.length === 0) {
      setError("Your response is required for this question");
      return;
    }

    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 MultipleChoiceScreen behavior data:", data);
    console.log("Selected Options:", selectedOptions);
    setCurrentQuestionIndex?.((i) => i + 1);
  }, [isRequired, selectedOptions, markSubmission, collectBehaviorData, setCurrentQuestionIndex]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const getPulseTargets = useCallback(() => {
    const id = lastChangedIDRef.current;
    return id ? [optionRefMap.current[id]] : [];
  }, [selectedOptions]);

  const { isAutoSubmitting, etaMs, cancel } = useAutoSubmitPulse({
    active: selectedOptions.length > 0,
    delayMs: 4000,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets,
    vibrate: true,
  });

  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <div className="absolute bottom-[56%] z-2 my-[8%] mb-5 flex w-full flex-row items-end justify-center border-2 border-red-500 xl:bottom-[50%]">
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </div>

      {/* ★ Pending auto-submit hint & cancel */}
      {isAutoSubmitting && (
        <div
          className="absolute top-[42%] left-1/2 z-10 -translate-x-1/2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow"
          aria-live="polite"
        >
          Submitting in <strong>{(etaMs / 1000).toFixed(1)}s</strong>… change your choices or{" "}
          <button
            type="button"
            onClick={cancel}
            className="underline underline-offset-2 hover:opacity-80"
          >
            cancel
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute top-[44%] mx-auto flex h-[60%] w-full flex-col items-center justify-start border-2 border-red-500 xl:top-[50%]"
      >
        <div className="mx-auto flex h-[98%] w-full flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
          <MultipleChoiceList
            options={options!}
            selectedOptions={selectedOptions}
            onToggle={handleOptionToggle}
            registerOptionRef={(optionID, el) => {
              optionRefMap.current[optionID] = el;
            }}
          />
        </div>

        {/* Error message */}
        <div className="mx-auto flex h-[12%] w-[48%] flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
          {error && <InputError error={error} />}
        </div>

        <div className="mt-4 flex w-3/5 justify-end pr-6">
          <button
            onClick={handleSubmit}
            className="mr-8 min-w-[100px] rounded-[16px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceScreen;
