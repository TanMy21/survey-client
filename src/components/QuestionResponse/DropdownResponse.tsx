import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { SingleChoiceListProps } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InputError } from "../alert/ResponseErrorAlert";
import { ChevronDown, X } from "lucide-react";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useRegisterQuestionSubmit } from "@/context/QuestionNavigationContext";

const DropDownResponse = ({ surveyID, question }: SingleChoiceListProps) => {
  const { options } = question || {};
  const isMobile = useIsMobile();

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

  const { onSubmitAnswer } = useFlowRuntime();
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const submitInFlightRef = useRef(false);

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

  const isRequired = useQuestionRequired(question, selectedOptionID !== null);

  const handleSubmit = useCallback(async () => {
    if (!question || !selectedOptionID || !selectedOptionValue) {
      return;
    }

    if (hydrated && question) {
      markAnswered(question.questionID);
      onSubmitAnswer(selectedOptionValue);
      return;
    }

    if (!deviceID) return;

    if (submitInFlightRef.current) return;

    if (isRequired && !selectedOptionValue) {
      setError("Your response is required for this question");
      return;
    }

    if (!question?.questionID || !selectedOptionID || !selectedOptionValue) {
      return;
    }

    submitInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      handleFirstInteraction();
      handleClick();
      markAnswered(question.questionID);
      markSubmission();
      markAnsweredEvent();

      const behavior = collectBehaviorData();

      await mutateAsync({
        surveyID,
        questionID: question.questionID,
        qType: question.type,
        optionID: selectedOptionID,
        response: selectedOptionValue,
        deviceID,
        behavior,
      });

      setRealTimeResponse(question.questionID, selectedOptionValue, null);

      setError(null);
      onSubmitAnswer(selectedOptionValue);
    } catch (error) {
      console.error("Dropdown submit error:", error);
      setError("Could not save your response. Please try again.");
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }, [
    isRequired,
    hydrated,
    question,
    selectedOptionValue,
    question?.questionID,
    question?.type,
    selectedOptionID,
    surveyID,
    deviceID,
    handleFirstInteraction,
    handleClick,
    markAnswered,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
    mutateAsync,
    setRealTimeResponse,
    onSubmitAnswer,
  ]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const handleSelect = (optionID: string) => {
    handleFirstInteraction();
    markTouched(question?.questionID!);
    handleClick();

    if (selectedOptionID !== optionID) {
      handleOptionChange();
      clearHydration();
    }

    setSelectedOptionID(optionID);
    setIsDropdownOpen(false);

    if (error) setError(null);
  };

  // Dropdown close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!dropdownRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    handleBacktrack();
    triggerRef.current?.focus();
  }, [handleBacktrack]);

  useEffect(() => {
    if (hydrated && selectedOptionID) {
      markAnswered(question?.questionID!);
    }
  }, [hydrated, selectedOptionID, question?.questionID, markAnswered]);

  useAutoSubmitPulse({
    active: !!selectedOptionID && !hydrated,
    delayMs: 1500,
    feedbackMs: 160,
    onSubmit: handleSubmit,
    getPulseTargets: () => [triggerRef.current],
    vibrate: true,
  });

  useRegisterQuestionSubmit(isRequired || !!selectedOptionID, handleSubmit);

  const optionButtons = visibleOptions.map((option) => {
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
            ? "bg-[#0074EB]/10 text-[#005BC4]"
            : "text-slate-700 hover:bg-[#0074EB]/8 hover:text-[#005BC4]",
        ].join(" ")}
      >
        {option.text}
      </button>
    );
  });

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

            {isDropdownOpen && !isMobile && (
              <div
                ref={menuRef}
                // Prevents scroll gestures inside the dropdown from reaching parent question navigation.
                onWheelCapture={(event) => event.stopPropagation()}
                onTouchMoveCapture={(event) => event.stopPropagation()}
                className="absolute top-full left-0 z-50 mt-2 w-full rounded-3xl border border-[#0074EB]/15 bg-white p-2 shadow-[0_18px_45px_rgba(0,116,235,0.14)]"
              >
                <div
                  role="listbox"
                  // `overscroll-contain` stops scroll chaining when the list reaches top/bottom.
                  className={[
                    "max-h-[240px] overflow-y-auto overscroll-contain pr-1",
                    "[scrollbar-width:thin]",
                    "[scrollbar-color:#0074EB_transparent]",
                    "[&::-webkit-scrollbar]:w-1.5",
                    "[&::-webkit-scrollbar-track]:bg-transparent",
                    "[&::-webkit-scrollbar-thumb]:rounded-full",
                    "[&::-webkit-scrollbar-thumb]:bg-[#0074EB]",
                    "[&::-webkit-scrollbar-thumb:hover]:bg-[#005BC4]",
                  ].join(" ")}
                >
                  {optionButtons}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto flex h-[12%] w-[98%] flex-col items-center justify-start xl:top-[50%]">
          {error && <InputError error={error} />}
        </div>

        <div className="mt-2 hidden w-[112%] justify-end pr-6 md:flex">
          <button
            disabled={isSubmitting || isPending}
            onClick={handleSubmit}
            className="w-[80px] rounded-[20px] bg-[#005BC4] px-4 py-2 font-bold text-white transition hover:bg-[#004a9f] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            OK
          </button>
        </div>
      </div>

      {isDropdownOpen &&
        isMobile &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-end" role="presentation">
            <div
              className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]"
              onMouseDown={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Select an option"
              className="relative flex max-h-[70dvh] w-full flex-col rounded-t-3xl bg-white px-3 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-18px_45px_rgba(15,23,42,0.18)]"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <span className="text-base font-semibold text-slate-900">Select an option</span>
                <button
                  type="button"
                  aria-label="Close options"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>
              <div
                role="listbox"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 [scrollbar-color:#0074EB_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#0074EB] [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {optionButtons}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DropDownResponse;
