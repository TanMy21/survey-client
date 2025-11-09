import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { SingleChoiceListProps } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import SingleChoiceListItem from "./SingleChoiceListItem";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const SingleChoiceList = ({ question }: SingleChoiceListProps) => {
  const { options } = question || {};
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const { setResponse } = useResponseRegistry();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
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

  const handleSubmit = useCallback(async () => {
    const optionValue = options?.find((opt) => opt.optionID === selectedOptionID)?.value;

    if (isRequired && !optionValue) {
      setError("Your response is required for this question");
      return;
    }

    if (!question?.questionID || !deviceID || !selectedOptionID || !optionValue) return;

    handleFirstInteraction();
    handleClick();

    markSubmission();
    const behavior = collectBehaviorData();
    console.log("📦 SingleChoiceList behavior data:", behavior);
    console.log("Selected option value:", optionValue);

    await mutateAsync({
      questionID: question.questionID,
      qType: question.type,
      optionID: selectedOptionID,
      response: optionValue,
      deviceID,
      behavior,
    });

    setError(null);
    setResponse(question.questionID, true);

    onSubmitAnswer(optionValue!);
  }, [options, selectedOptionID, isRequired, markSubmission, mutateAsync, collectBehaviorData]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const handleSelect = (optionID: string) => {
    handleFirstInteraction();

    if (selectedOptionID !== optionID) {
      handleOptionChange();
    }
    handleClick();
    setSelectedOptionID(optionID);
    if (error) setError(null);
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

  useAutoSubmitPulse({
    active: !!selectedOptionID,
    delayMs: 2000,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets,
    vibrate: true,
  });

  return (
    <div className="flex w-[100%] origin-bottom flex-col sm:w-[60%]">
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

export default SingleChoiceList;
