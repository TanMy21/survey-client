import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { SingleChoiceListProps } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { ChevronDown } from "lucide-react";

const DropDownResponse = ({ surveyID, question }: SingleChoiceListProps) => {
  const { options } = question || {};

  const {
    value: selectedOptionID,
    setValue: setSelectedOptionID,
    hydrated,
    clearHydration,
  } = useHydratedResponse<string | null>({
    question: question!,
    defaultValue: null,
    mapPersisted: (p) => {
      if (p.optionID) return p.optionID;

      const match = options?.find((opt) => opt.value === p.value);
      return match ? match.optionID : null;
    },
  });

  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();

  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const {
    handleFirstInteraction,
    handleBacktrack,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const visibleOptions = options?.slice(0, 20) || [];

  const selectedOption = options?.find((opt) => opt.optionID === selectedOptionID);

  const selectedOptionValue = selectedOption?.value;
  const selectedOptionText = selectedOption?.text;

  /**
   * Submits the selected dropdown answer.
   * Keeps the original validation, behavior tracking, and flow submission.
   */
  const handleSubmit = useCallback(async () => {
    if (isRequired && !selectedOptionValue) {
      setError("Your response is required for this question");
      return;
    }

    if (!question?.questionID || !selectedOptionID || !selectedOptionValue) {
      return;
    }

    handleFirstInteraction();
    handleClick();
    markAnswered(question.questionID);
    markSubmission();
    markAnsweredEvent();

    const behavior = collectBehaviorData();

    /**
     * Temporary only.
     * Backend submission will be added later.
     */
    console.log("📦 DropDownResponse behavior data:", behavior);
    console.log("Dropdown selected option:", {
      surveyID,
      questionID: question.questionID,
      qType: question.type,
      optionID: selectedOptionID,
      value: selectedOptionValue,
      text: selectedOptionText,
    });

    setRealTimeResponse(question.questionID, selectedOptionValue, null);

    setError(null);
    onSubmitAnswer(selectedOptionValue);
  }, [
    isRequired,
    selectedOptionValue,
    question?.questionID,
    question?.type,
    selectedOptionID,
    selectedOptionText,
    surveyID,
    handleFirstInteraction,
    handleClick,
    markAnswered,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
    setRealTimeResponse,
    onSubmitAnswer,
  ]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  /**
   * Selects an option from the custom dropdown.
   * Keeps the original touch, click, option-change, and hydration behavior.
   */
  const handleSelect = (optionID: string) => {
    handleFirstInteraction();
    markTouched(question?.questionID!);

    if (selectedOptionID !== optionID) {
      handleOptionChange();
    }

    handleClick();
    setSelectedOptionID(optionID);
    clearHydration();
    setIsDropdownOpen(false);

    if (error) setError(null);
  };

  /**
   * Closes the dropdown when clicking outside the custom select.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Handles backtrack behavior and focuses the custom select trigger.
   */
  useEffect(() => {
    handleBacktrack();
    triggerRef.current?.focus();
  }, [handleBacktrack]);

  useAutoSubmitPulse({
    active: !!selectedOptionID && !hydrated,
    delayMs: 2000,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets: () => [triggerRef.current],
    vibrate: true,
  });

  useEffect(() => {
    if (hydrated && selectedOptionID) {
      markAnswered(question?.questionID!);
    }
  }, [hydrated, selectedOptionID, question?.questionID, markAnswered]);

  return (
    <div className="flex w-full origin-bottom flex-col sm:w-[60%]">
      <div
        className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2"
        onKeyDown={handleKeyDown}
      >
        <div className="mx-auto flex w-[96%] flex-col items-center gap-2 p-1 md:w-full">
          <div ref={dropdownRef} className="relative w-full">
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDropdownOpen(true);
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDropdownOpen(false);
                }
              }}
              className={[
                "flex h-14 w-full items-center justify-between rounded-3xl border bg-white",
                "px-4 text-left text-[15px] font-semibold",
                "shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                "transition outline-none",
                selectedOptionID
                  ? "border-[#7C3AED] text-slate-900 ring-2 ring-[#7C3AED]/10"
                  : "border-slate-200 text-slate-400 hover:border-slate-300",
                isDropdownOpen ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/15" : "",
              ].join(" ")}
            >
              <span className="truncate">{selectedOptionText || "Select an option"}</span>

              <ChevronDown
                size={20}
                className={[
                  "shrink-0 text-slate-500 transition-transform",
                  isDropdownOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                <div
                  role="listbox"
                  // Keeps menu scrollable but visually hides the scrollbar.
                  className="max-h-[240px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {visibleOptions.map((option) => {
                    const isSelected = option.optionID === selectedOptionID;

                    return (
                      <button
                        key={option.optionID}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option.optionID)}
                        onKeyDown={(event) => {
                          event.stopPropagation();

                          if (event.key === "Escape") {
                            event.preventDefault();
                            setIsDropdownOpen(false);
                            triggerRef.current?.focus();
                          }
                        }}
                        className={[
                          "w-full rounded-2xl px-3 py-3 text-left text-[15px] font-semibold transition",
                          isSelected
                            ? "bg-[#7C3AED]/10 text-[#6D28D9]"
                            : "text-slate-700 hover:bg-slate-100",
                        ].join(" ")}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto flex h-[12%] w-[98%] flex-col items-center justify-start xl:top-[50%]">
          {error && <InputError error={error} />}
        </div>

        <div className="mt-2 flex w-[112%] justify-end pr-6">
          <button
            onClick={handleSubmit}
            className="w-[80px] rounded-[20px] bg-[#005BC4] px-4 py-2 font-bold text-white transition hover:bg-[#004a9f]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropDownResponse;
