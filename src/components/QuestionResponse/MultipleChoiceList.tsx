import type { MultipleChoiceListProps } from "@/types/response";
import MultipleChoiceListItem from "./MultipleChoiceListItem";

const MultipleChoiceList = ({
  options,
  selectedOptions,
  onToggle,
  registerOptionRef,
}: MultipleChoiceListProps) => {
  return (
    <div className="flex w-[60%] origin-bottom flex-col">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2">
        <div className="mx-auto flex w-[96%] flex-col items-center gap-2 p-1 md:w-full">
          {options?.map((option, index) => (
            <div
              key={option.optionID}
              ref={(el) => registerOptionRef?.(option.optionID, el)}
              className="mx-auto w-[96%]"
            >
              <MultipleChoiceListItem
                key={option.optionID}
                response={option}
                index={index}
                checked={selectedOptions.some((o) => o.optionID === option.optionID)}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceList;
