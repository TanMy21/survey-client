import { useIsMobile } from "@/hooks/useIsMobile";
import MediaOption from "./MediaOption";
import type { MediaOptionsProps } from "@/types/response";
import { useEffect, useRef, useState } from "react";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { InputError } from "../alert/ResponseErrorAlert";

const MediaOptionsContainer = ({
  options,
  multiSelect,
  setCurrentQuestionIndex,
  question,
}: MediaOptionsProps) => {
  const isMobile = useIsMobile();
  const isRequired = useQuestionRequired(question);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSelect = (optionID: string) => {
    setSelectedOptions((prev) => {
      if (multiSelect) {
        return prev.includes(optionID) ? prev.filter((id) => id !== optionID) : [...prev, optionID];
      } else {
        return prev.includes(optionID) ? [] : [optionID];
      }
    });
  };

  const handleSubmit = () => {
    if (isRequired && selectedOptions.length === 0) {
      setError("Your response is required for this question");
      return;
    }

    const selected = options
      .filter((opt) => selectedOptions.includes(opt.optionID))
      .map(({ optionID, value }) => ({ optionID, value }));

    console.log("Selected Media Options:", selected);
    setCurrentQuestionIndex?.((i) => i + 1);
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div className="grid w-4/5 gap-2 border-2 border-amber-600 px-1">
      {/* Error message */}
      <div className="mx-auto mt-2 flex h-[12%] w-[52%] flex-col items-center justify-start border-2 border-amber-700 xl:top-[50%]">
        {error && <InputError error={error} />}
      </div>
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`mb-4 grid w-3/5 px-1 ${
          isMobile ? "grid-cols-1" : "sm:grid-cols-2 md:grid-cols-3"
        } mx-auto gap-2 sm:gap-3 md:w-[96%] md:gap-6 xl:w-3/5`}
      >
        {options.map((option) => (
          <MediaOption
            key={option.optionID}
            option={option}
            isSelected={selectedOptions.includes(option.optionID)}
            onSelect={() => toggleSelect(option.optionID)}
          />
        ))}
      </div>
      <div className="mx-auto mt-6 flex w-3/5 justify-end border-2 border-amber-600 pr-6">
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

export default MediaOptionsContainer;
