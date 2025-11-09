import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { RangeResponseProps } from "@/types/responseTypes";
import { useState } from "react";
import ProgressiveSlider from "./ProgressiveSlider";
import ScaleCounter from "./ScaleCounter";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const RangeResponse = ({ question }: RangeResponseProps) => {
  const isMobile = useIsMobile();
  const { minValue, maxValue } = question.questionPreferences?.uiConfig || {};
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(Math.ceil((minValue + maxValue) / 2));
  const { setResponse } = useResponseRegistry();

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSliderChange = (value: number) => {
    handleFirstInteraction();
    handleClick();
    setSelectedValue((prev) => {
      if (prev !== value) {
        handleOptionChange();
      }
      return value;
    });

    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (isRequired && (selectedValue === null || Number.isNaN(selectedValue))) {
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

    const behavior = collectBehaviorData();
    console.log("📦 RangeScreen behavior data:", behavior);
    console.log("Submitted Range Value:", selectedValue);

    await mutateAsync({
      questionID: question.questionID,
      qType: question.type,
      optionID: null,
      response: selectedValue,
      deviceID,
      behavior,
    });

    setResponse(question.questionID, true);

    onSubmitAnswer(selectedValue);
  };

  return (
    <div className="w-4/5 p-2 sm:p-3 md:p-4 xl:p-6">
      {isMobile ? (
        <ScaleCounter question={question} value={selectedValue} setValue={handleSliderChange} />
      ) : (
        <ProgressiveSlider
          question={question}
          value={selectedValue}
          setValue={handleSliderChange}
        />
      )}
      <div className="mt-4 flex w-[104%] justify-end pr-6">
        <button
          onClick={handleSubmit}
          className="w-[80px] rounded-[24px] bg-[#005BC4] px-4 py-2 font-bold text-white transition hover:bg-[#004a9f]"
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default RangeResponse;
