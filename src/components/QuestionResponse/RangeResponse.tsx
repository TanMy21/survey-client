import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { RangeResponseProps } from "@/types/responseTypes";
import { useState } from "react";
import ProgressiveSlider from "./ProgressiveSlider";
import ScaleCounter from "./ScaleCounter";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";

const RangeResponse = ({ question }: RangeResponseProps) => {
  const isMobile = useIsMobile();
  const { minValue, maxValue } = question.questionPreferences?.uiConfig || {};
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(Math.ceil((minValue + maxValue) / 2));

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
    handleOptionChange();
    setSelectedValue(value);
  };

  const handleSubmit = () => {
    if (isRequired && selectedValue === null) {
      setError("Your response is required for this question");
      return;
    }

    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 RangeScreen behavior data:", data);
    console.log("Submitted Range Value:", selectedValue);
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
