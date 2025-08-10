import type { RangeResponseProps } from "@/types/response";
import ProgressiveSlider from "./ProgressiveSlider";
import ScaleCounter from "./ScaleCounter";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useBehavior } from "@/context/BehaviorTrackerContext";

const RangeResponse = ({ question, setCurrentQuestionIndex }: RangeResponseProps) => {
  const isMobile = useIsMobile();
  const { minValue, maxValue } = question.questionPreferences?.uiConfig || {};
  const isRequired = useQuestionRequired(question);
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
    handleFirstInteraction(); // for touch/click
    handleClick(); // for touch/click
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
    setCurrentQuestionIndex?.((i) => i + 1);
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
      <div className="mt-4 flex w-3/5 justify-end pr-6">
        <button
          onClick={handleSubmit}
          className="mr-8 min-w-[100px] rounded-[16px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RangeResponse;
