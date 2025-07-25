import { useIsMobile } from "@/hooks/useIsMobile";
import MediaOption from "./MediaOption";
import type { MediaOptionsProps } from "@/types/response";
import { useState } from "react";

const MediaOptionsContainer = ({
  options,
  multiSelect,
  setCurrentQuestionIndex,
}: MediaOptionsProps) => {
  const isMobile = useIsMobile();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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
    const selected = options
      .filter((opt) => selectedOptions.includes(opt.optionID))
      .map(({ optionID, value }) => ({ optionID, value }));

    console.log("Selected Media Options:", selected);

    setCurrentQuestionIndex?.((i) => i + 1);
  };

  return (
    <div
      className={`grid w-3/5 px-1 ${
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
      <div className="mt-6 flex w-3/5 justify-end pr-6">
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
