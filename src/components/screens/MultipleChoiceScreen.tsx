import type { QuestionProps } from "@/types/question";
import { useEffect, useRef, useState } from "react";
import QuestionTextandDescription from "../QuestionTextandDescription";
import MultipleChoiceList from "../questionresponse/MultipleChoiceList";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { InputError } from "../alert/ResponseErrorAlert";

const MultipleChoiceScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const { options } = question || {};
  const isRequired = useQuestionRequired(question);
  const [selectedOptions, setSelectedOptions] = useState<{ optionID: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOptionToggle = (optionID: string, value: string) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((option) => option.optionID === optionID);
      if (exists) {
        return prev.filter((option) => option.optionID !== optionID);
      } else {
        return [...prev, { optionID, value }];
      }
    });
  };

  const handleSubmit = () => {
    if (isRequired && selectedOptions.length === 0) {
      setError("Your response is required for this question");
      return;
    }

    console.log("Selected Options:", selectedOptions);
    setCurrentQuestionIndex?.((i) => i + 1);
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <div className="absolute bottom-[56%] z-2 my-[8%] mb-5 flex w-full flex-row items-end justify-center border-2 border-red-500 xl:bottom-[50%]">
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </div>
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute top-[44%] mx-auto flex h-[60%] w-full flex-col items-center justify-start border-2 border-red-500 xl:top-[50%]"
      >
        <div className="mx-auto flex h-[98%] w-full flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
          <MultipleChoiceList
            options={options!}
            selectedOptions={selectedOptions}
            onToggle={handleOptionToggle}
          />
        </div>
        {/* Error message */}
        <div className="mx-auto flex h-[12%] w-[48%] flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
          {error && <InputError error={error} />}
        </div>
        <div className="mt-4 flex w-3/5 justify-end pr-6">
          <button
            onClick={handleSubmit}
            className="mr-8 min-w-[100px] rounded-[16px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceScreen;
