import type { SingleChoiceListProps } from "@/types/response";
import SingleChoiceListItem from "./SingleChoiceListItem";

const SingleChoiceList = ({
  options,
  selectedOptionID,
  setSelectedOptionID,
}: SingleChoiceListProps) => {
  return (
    <div className="flex w-[60%] origin-bottom flex-col">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2">
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
      </div>
    </div>
  );
};

export default SingleChoiceList;
