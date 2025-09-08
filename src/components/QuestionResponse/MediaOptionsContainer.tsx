import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { MediaOptionsProps } from "@/types/responseTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import MediaOption from "./MediaOption";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";

const MediaOptionsContainer = ({ options, question }: MediaOptionsProps) => {
  const isMobile = useIsMobile();
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ optionID: string; value: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefMap = useRef<Record<string, HTMLDivElement | null>>({});
  const lastChangedIDRef = useRef<string | null>(null);
  const { handleFirstInteraction, handleClick, markSubmission, collectBehaviorData } =
    useBehavior();

  const toggleSelect = useCallback(
    (optionID: string) => {
      handleFirstInteraction();
      handleClick();
      const opt = options.find((o) => o.optionID === optionID);
      const optionValue = opt?.value ?? opt?.text ?? optionID;

      setSelectedOptions((prev) => {
        const exists = prev.find((o) => o.optionID === optionID);
        const next = exists
          ? prev.filter((o) => o.optionID !== optionID)
          : [...prev, { optionID, value: optionValue }];

        lastChangedIDRef.current = optionID;
        return next;
      });

      if (error) setError(null);
    },
    [options, handleClick, handleFirstInteraction, error]
  );

  const handleSubmit = useCallback(() => {
    if (isRequired && selectedOptions.length === 0) {
      setError("Your response is required for this question");
      return;
    }

    markSubmission();

    const behaviorData = collectBehaviorData();
    console.log("📦 MediaScreen behavior data:", behaviorData);

    const selectedValues = selectedOptions.map((o) => o.value);
    console.log("Selected Media Options:", selectedValues);

    onSubmitAnswer(selectedValues);
  }, [isRequired, selectedOptions, markSubmission, collectBehaviorData, onSubmitAnswer]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const getPulseTargets = useCallback(() => {
    const id = lastChangedIDRef.current;
    return id ? [optionRefMap.current[id]] : [];
  }, [selectedOptions]);

  // const { isAutoSubmitting, etaMs, cancel } =
  useAutoSubmitPulse({
    active: selectedOptions.length > 0,
    delayMs: 6000,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets,
    vibrate: true,
  });

  const selectedSet = useMemo(() => {
    const s = new Set<string>();
    for (const o of selectedOptions) s.add(o.optionID);
    return s;
  }, [selectedOptions]);

  const assignOptionRef = useCallback(
    (optionID: string) => (el: HTMLDivElement | null) => {
      optionRefMap.current[optionID] = el;
    },
    []
  );

  return (
    <div className="grid w-full gap-2 px-1 [@media(min-width:1200px)]:w-[120%]">
      {/* Error message */}
      <div className="mx-auto mt-2 flex h-[12%] w-[52%] flex-col items-center justify-start xl:top-[50%]">
        {error && <InputError error={error} />}
      </div>
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`mb-4 grid w-full px-1 ${
          isMobile ? "grid-cols-1" : "sm:grid-cols-2 md:grid-cols-3"
        } smm:w-full mx-auto gap-4 sm:gap-3 md:w-[100%] md:gap-6 xl:w-4/5`}
      >
        {options.map((option) => {
          const isSelected = selectedSet.has(option.optionID);
          return (
            <div key={option.optionID} ref={assignOptionRef(option.optionID)}>
              <MediaOption
                key={option.optionID}
                option={option}
                isSelected={isSelected}
                onSelect={() => toggleSelect(option.optionID)}
              />
            </div>
          );
        })}
      </div>
      <div className="mx-auto mt-6 flex w-full justify-end pr-6">
        <button
          onClick={handleSubmit}
          className="mr-8 min-w-[80px] rounded-[20px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MediaOptionsContainer;
