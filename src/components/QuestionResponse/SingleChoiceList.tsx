import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { SingleChoiceListProps } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import SingleChoiceListItem from "./SingleChoiceListItem";

const SingleChoiceList = ({ question, setCurrentQuestionIndex }: SingleChoiceListProps) => {
  const { options } = question || {};
  const isRequired = useQuestionRequired(question);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedOptionID, setSelectedOptionID] = useState<string | null>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    handleFirstInteraction,
    handleBacktrack,
    handleClick,
    handleOptionChange,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSubmit = useCallback(() => {
    const optionValue = options?.find((opt) => opt.optionID === selectedOptionID)?.value;

    if (isRequired && !optionValue) {
      setError("Your response is required for this question");
      return;
    }

    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 SingleChoiceList behavior data:", data);
    console.log("Selected option value:", optionValue);

    if (selectedOptionID) {
      setCurrentQuestionIndex?.((i) => i + 1);
    } else {
      alert("Please select an option before submitting.");
    }
  }, [
    options,
    selectedOptionID,
    isRequired,
    markSubmission,
    collectBehaviorData,
    setCurrentQuestionIndex,
  ]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const handleSelect = (optionID: string) => {
    handleFirstInteraction();

    if (selectedOptionID !== optionID) {
      handleOptionChange();
    }
    handleClick();
    setSelectedOptionID(optionID);
  };

  useEffect(() => {
    handleBacktrack();
    containerRef.current?.focus();
  }, [handleBacktrack]);

  const getPulseTargets = useCallback(() => {
    if (!selectedOptionID) return [];
    const index = options?.findIndex((opt) => opt.optionID === selectedOptionID);
    if (index == null || index === -1) return [];
    return [optionRefs.current[index]];
  }, [selectedOptionID, options]);

  const { isAutoSubmitting, etaMs, cancel } = useAutoSubmitPulse({
    active: !!selectedOptionID,
    delayMs: 4000,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets,
    vibrate: true,
  });

  return (
    <div className="flex w-[60%] origin-bottom flex-col">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2"
      >
        <div className="mx-auto flex w-[96%] flex-col items-center gap-2 p-1 md:w-full">
          {options?.map((option, index) => (
            <div
              key={option.optionID}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              className="w-full"
            >
              <SingleChoiceListItem
                response={option}
                index={index}
                selected={selectedOptionID === option.optionID}
                onSelect={() => handleSelect(option.optionID)}
              />
            </div>
          ))}
        </div>

        {/* Error message */}
        <div className="mx-auto flex h-[12%] w-[98%] flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
          {error && <InputError error={error} />}
        </div>

        {/* ★ Pending auto-submit hint & cancel */}
        {isAutoSubmitting && (
          <div
            className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
            aria-live="polite"
          >
            <span>
              Submitting in <strong>{(etaMs / 1000).toFixed(1)}s</strong>… change your choice or{" "}
              <button
                type="button"
                onClick={cancel}
                className="underline underline-offset-2 hover:opacity-80"
              >
                cancel
              </button>
            </span>
          </div>
        )}

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

export default SingleChoiceList;
