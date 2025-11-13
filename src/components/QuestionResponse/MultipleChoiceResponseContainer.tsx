import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { MultipleChoiceContainerProps } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import MultipleChoiceList from "./MultipleChoiceList";
import { InputError } from "../alert/ResponseErrorAlert";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const MultipleChoiceResponseContainer = ({surveyID, question }: MultipleChoiceContainerProps) => {
  const { options } = question || {};
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { setResponse } = useResponseRegistry();
  const { mutateAsync, isPending } = useSubmitResponse();
  const [selectedOptions, setSelectedOptions] = useState<{ optionID: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefMap = useRef<Record<string, HTMLDivElement | null>>({});
  const submitRef = useRef<() => void | Promise<void>>(() => {});
  const lastChangedIDRef = useRef<string | null>(null);

  const stableSubmit = useCallback(() => submitRef.current(), []);

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
    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.optionID === optionID);
      const next = exists
        ? prev.filter((o) => o.optionID !== optionID)
        : [...prev, { optionID, value }];

      if ((exists && next.length !== prev.length) || (!exists && next.length !== prev.length)) {
        handleOptionChange();
      }

      lastChangedIDRef.current = optionID;
      return next;
    });

    if (error) setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (isRequired && selectedOptions.length === 0) {
      setError("Your response is required for this question");
      return;
    }

    if (!deviceID || !question?.questionID || !question?.type) {
      setError("Missing identifiers. Please reload and try again.");
      return;
    }

    handleFirstInteraction();
    handleClick();
    markSubmission();

    const behaviorData = collectBehaviorData();
    console.log("📦 MultipleChoiceScreen behavior data:", behaviorData);
    console.log("Selected Options:", selectedOptions);

    const selectedValues = selectedOptions.map((o) => o.value);

    await mutateAsync({
      questionID: question.questionID,
      qType: question.type,
      optionID: null,
      response: selectedValues,
      deviceID,
      behavior: behaviorData,
      surveyID,
    });

    setResponse(question.questionID, selectedOptions.length > 0);

    onSubmitAnswer(selectedValues);
  }, [
    isRequired,
    selectedOptions,
    deviceID,
    question?.questionID,
    question?.type,
    handleFirstInteraction,
    handleClick,
    markSubmission,
    collectBehaviorData,
    mutateAsync,
    setResponse,
    onSubmitAnswer,
  ]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const getPulseTargets = useCallback(() => {
    const id = lastChangedIDRef.current;
    return id ? [optionRefMap.current[id]] : [];
  }, [selectedOptions]);

  useAutoSubmitPulse({
    active: selectedOptions.length > 0,
    delayMs: 4000,
    feedbackMs: 180,
    onSubmit: stableSubmit,
    getPulseTargets,
    vibrate: true,
    deps: [selectedOptions],
  });

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  return (
    <div className="flex w-[100%] origin-bottom flex-col sm:w-[60%]">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:px-2"
      >
        <div className="mx-auto flex h-[98%] w-full flex-col items-center justify-start xl:top-[50%]">
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
        <div className="mx-auto flex h-[12%] w-[48%] flex-col items-center justify-start xl:top-[50%]">
          {error && <InputError error={error} />}
        </div>

        <div className="mt-2 flex w-[88%] justify-end pr-6">
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

export default MultipleChoiceResponseContainer;
