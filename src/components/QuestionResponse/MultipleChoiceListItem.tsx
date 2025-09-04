import type { MultipleChoiceListItemProps } from "@/types/responseTypes";
import CustomCheckbox from "../screen-components/CustomCheckbox";

const MultipleChoiceListItem = ({ response, checked, onToggle }: MultipleChoiceListItemProps) => {
  return (
    <div className="mx-auto mb-1.5 flex min-h-[72px] w-full cursor-pointer flex-row items-center gap-2 rounded-4xl border border-gray-300 bg-[#f8f9fc] p-2 shadow-[8px_8px_24px_#e0e0e0,-8px_-8px_24px_#ffffff] transition-shadow duration-200 hover:bg-[#f5f7ff] hover:shadow-[0_4px_12px_rgba(80,84,255,0.12)] md:min-h-[64px]">
      <div className="ml-2 flex scale-125 items-center justify-center text-[#CFD3D9]">
        <CustomCheckbox
          id={`opt-${response.optionID}`}
          checked={checked}
          onChange={() => onToggle(response.optionID, response.text)}
          label={response.text}
        />
      </div>

      <div className="flex-1 break-words">
        <div className="px-1 py-1 text-sm font-bold text-[#626B77] md:text-base">
          {response.text}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceListItem;
