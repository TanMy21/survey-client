import type { BinaryResponseContainerProps } from "@/types/responseTypes";

import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { useCallback, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { BinaryResponseYes, BinaryResponseNo } from "./BinaryResponseYes";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";

const BinaryResponseContainer = ({ question }: BinaryResponseContainerProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { questionID, questionPreferences } = question;
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const buttonTextYes = questionPreferences.uiConfig?.buttonTextYes || "Yes";
  const buttonTextNo = questionPreferences.uiConfig?.buttonTextNo || "No";

  const autoSubmitDelayMs = 2000;

  const yesRef = useRef<HTMLDivElement | null>(null);
  const noRef = useRef<HTMLDivElement | null>(null);

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSubmit = useCallback(async () => {
    if (isRequired && selectedValue === null) {
      setError("Your response is required for this question");
      return;
    }

    if (!deviceID || !questionID || !selectedValue) return;

    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 BinaryResponse behavior data:", data);
    console.log("Selected response:", selectedValue);

    await mutateAsync({
      deviceID,
      questionID,
      optionID: null,
      qType: question.type,
      response: selectedValue,
      behavior: data,
    });

    onSubmitAnswer(selectedValue);
  }, [collectBehaviorData, mutateAsync, isRequired, selectedValue, markSubmission, onSubmitAnswer]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const getPulseTargets = useCallback(() => {
    if (selectedValue === "YES") return [yesRef.current];
    if (selectedValue === "NO") return [noRef.current];
    return [];
  }, [selectedValue]);

  const { isAutoSubmitting, etaMs, cancel } = useAutoSubmitPulse({
    active: selectedValue !== null,
    delayMs: autoSubmitDelayMs,
    feedbackMs: 180,
    onSubmit: handleSubmit,
    getPulseTargets,
    vibrate: true,
  });

  const selectYes = () => {
    handleFirstInteraction();
    handleClick();
    handleOptionChange();
    setSelectedValue("YES");
    setError(null);
  };
  const selectNo = () => {
    handleFirstInteraction();
    handleClick();
    handleOptionChange();
    setSelectedValue("NO");
    setError(null);
  };

  const onOptionKeyDown = (onSelect: () => void) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  const fmtSeconds = (ms: number) => (ms / 1000).toFixed(1);

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2 p-2 sm:w-4/5">
      {/* Pending auto-submit hint & cancel */}
      {isAutoSubmitting && (
        <div
          className="mt-2 mb-2 flex items-center justify-between rounded-lg bg-yellow-400 px-3 py-2 text-xl font-bold text-gray-600"
          aria-live="polite"
        >
          <span>
            Submitting in <strong>{fmtSeconds(etaMs)}s</strong>… change your choice or{" "}
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

      <div
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Binary response container"
        className="flex h-full w-[98%] flex-col gap-2 md:w-4/5"
      >
        <div className="mx-auto flex h-full w-[98%] flex-col gap-2 sm:w-[80%]">
          {/* YES */}
          <div
            ref={yesRef}
            role="radio"
            aria-checked={selectedValue === "YES"}
            tabIndex={0}
            onClick={selectYes}
            onKeyDown={onOptionKeyDown(selectYes)}
            className={[
              "choice-wrapper",
              "cursor-pointer rounded-xl transition",
              "shadow-none ring-0 outline-none",
              "focus:shadow-none focus:ring-0 focus:outline-none",
              "focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none",
              "[&_*]:shadow-none [&_*]:ring-0 [&_*]:outline-none",
              "[&_*]:focus:shadow-none [&_*]:focus:ring-0 [&_*]:focus:outline-none",
              "[&_*]:focus-visible:shadow-none [&_*]:focus-visible:ring-0 [&_*]:focus-visible:outline-none",
            ].join(" ")}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <BinaryResponseYes
              questionID={questionID}
              responseOptionText={buttonTextYes}
              index={0}
              value="YES"
              checked={selectedValue === "YES"}
              onChange={selectYes}
            />
          </div>

          {/* NO */}
          <div
            ref={noRef}
            role="radio"
            aria-checked={selectedValue === "NO"}
            tabIndex={1}
            onClick={selectNo}
            onKeyDown={onOptionKeyDown(selectNo)}
            className={`cursor-pointer rounded-xl transition`}
          >
            <BinaryResponseNo
              questionID={questionID}
              responseOptionText={buttonTextNo}
              index={1}
              value="NO"
              checked={selectedValue === "NO"}
              onChange={selectNo}
            />
          </div>
        </div>

        {error && <InputError error={error} />}

        <div className="mt-4 flex w-full justify-end pr-6">
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

export default BinaryResponseContainer;
