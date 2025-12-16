import type { BinaryResponseContainerProps } from "@/types/responseTypes";
import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useAutoSubmitPulse } from "@/hooks/useAutoSubmit";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { BinaryResponseYes, BinaryResponseNo } from "./BinaryResponseYes";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const BinaryResponseContainer = ({ question, surveyID }: BinaryResponseContainerProps) => {
  const { questionID, questionPreferences } = question;
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const buttonTextYes = questionPreferences.uiConfig?.buttonTextYes || "YES";
  const buttonTextNo = questionPreferences.uiConfig?.buttonTextNo || "NO";

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

  const {
    value: selectedValue,
    setValue: setSelectedValue,
    hydrated,
    clearHydration,
  } = useHydratedResponse<string>({
    question,
    mapPersisted: (p) => p.value,
  });

  const handleSubmit = useCallback(async () => {
    if (isRequired && selectedValue === null) {
      setError("Your response is required for this question");
      return;
    }

    if (!deviceID || !questionID || !selectedValue) return;

    markAnswered(questionID);

    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 BinaryResponse behavior data:", data);
    console.log("Selected response:", selectedValue);

    await mutateAsync({
      surveyID,
      deviceID,
      questionID,
      optionID: null,
      qType: question.type,
      response: selectedValue,
      behavior: data,
    });

    setRealTimeResponse(questionID, selectedValue, null);

    onSubmitAnswer(selectedValue);
  }, [
    collectBehaviorData,
    mutateAsync,
    hydrated,
    isRequired,
    selectedValue,
    markSubmission,
    onSubmitAnswer,
  ]);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const getPulseTargets = useCallback(() => {
    if (selectedValue === buttonTextYes) return [yesRef.current];
    if (selectedValue === buttonTextNo) return [noRef.current];
    return [];
  }, [selectedValue]);

  useAutoSubmitPulse({
    active: selectedValue !== null && !hydrated,
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
    markTouched(questionID);
    if (selectedValue !== buttonTextYes) {
      handleOptionChange();
    }
    setSelectedValue(buttonTextYes);
    clearHydration();
    setError(null);
  };
  const selectNo = () => {
    handleFirstInteraction();
    handleClick();
    handleOptionChange();
    markTouched(questionID);
    if (selectedValue !== buttonTextNo) {
      handleOptionChange();
    }
    setSelectedValue(buttonTextNo);
    clearHydration();
    setError(null);
  };

  const onOptionKeyDown = (onSelect: () => void) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  useEffect(() => {
    if (hydrated && selectedValue != null) {
      markAnswered(questionID);
    }
  }, [hydrated, selectedValue, questionID, markAnswered]);

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2 p-2 sm:w-4/5">
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
            aria-checked={selectedValue === buttonTextYes}
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
              value={buttonTextYes}
              checked={selectedValue === buttonTextYes}
              onChange={selectYes}
            />
          </div>

          {/* NO */}
          <div
            ref={noRef}
            role="radio"
            aria-checked={selectedValue === buttonTextNo}
            tabIndex={1}
            onClick={selectNo}
            onKeyDown={onOptionKeyDown(selectNo)}
            className={`cursor-pointer rounded-xl transition`}
          >
            <BinaryResponseNo
              questionID={questionID}
              responseOptionText={buttonTextNo}
              index={1}
              value={buttonTextNo}
              checked={selectedValue === buttonTextNo}
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
