import { useEffect, useRef, useState } from "react";
import type { SingleChoiceListProps } from "@/types/response";
import SingleChoiceListItem from "./SingleChoiceListItem";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { InputError } from "../alert/ResponseErrorAlert";

const SingleChoiceList = ({ question, setCurrentQuestionIndex }: SingleChoiceListProps) => {
  const { options } = question || {};
  const isRequired = useQuestionRequired(question);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedOptionID, setSelectedOptionID] = useState<string | null>(null);

  const handleSubmit = () => {
    const option = options?.find((option) => option.optionID === selectedOptionID)?.value;

    if (isRequired && !option) {
      setError("Your response is required for this question");
      return;
    }

    console.log("Selected option ID:", option);
    if (selectedOptionID) {
      setCurrentQuestionIndex?.((i) => i + 1);
    } else {
      alert("Please select an option before submitting.");
    }
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div className="flex w-[60%] origin-bottom flex-col">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2"
      >
        <div className="mx-auto flex w-[96%] flex-col items-center gap-2 p-1 md:w-full">
          {options?.map((option, index) => (
            <SingleChoiceListItem
              key={option.optionID}
              response={option}
              index={index}
              selected={selectedOptionID === option.optionID}
              onSelect={() => setSelectedOptionID(option.optionID)}
            />
          ))}
        </div>
        {/* Error message */}
        <div className="mx-auto flex h-[12%] w-[98%] flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
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

export default SingleChoiceList;
