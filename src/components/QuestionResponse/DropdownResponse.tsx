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
  const selectRef = useRef<HTMLSelectElement | null>(null);

  const {
    handleFirstInteraction,
    handleBacktrack,
    handleClick,
    handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const selectedOption = options?.find((opt) => opt.optionID === selectedOptionID);

  const selectedOptionValue = selectedOption?.value;
  const selectedOptionText = selectedOption?.text;

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

  const handleSelect = (optionID: string) => {
    handleFirstInteraction();
    markTouched(question?.questionID!);

    if (selectedOptionID !== optionID) {
      handleOptionChange();
    }

    handleClick();
    setSelectedOptionID(optionID);
    clearHydration();

    if (error) setError(null);
  };

  useEffect(() => {
    handleBacktrack();
    selectRef.current?.focus();
  }, [handleBacktrack]);

  useAutoSubmitPulse({
    active: !!selectedOptionID && !hydrated,
    delayMs: 2000,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets: () => [selectRef.current],
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
          <div className="relative w-full">
            <select
              ref={selectRef}
              value={selectedOptionID || ""}
              onChange={(event) => handleSelect(event.target.value)}
              className={`w-full appearance-none rounded-2xl border bg-white px-4 py-4 pr-11 text-base font-semibold text-slate-800 shadow-sm transition outline-none ${
                selectedOptionID
                  ? "border-[#005BC4] ring-2 ring-[#005BC4]/10"
                  : "border-slate-200 hover:border-slate-300"
              } focus:border-[#005BC4] focus:ring-2 focus:ring-[#005BC4]/15`}
            >
              <option value="" disabled>
                Select an option
              </option>

              {options?.map((option) => (
                <option key={option.optionID} value={option.optionID}>
                  {option.text}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400">
              ▼
            </div>
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
