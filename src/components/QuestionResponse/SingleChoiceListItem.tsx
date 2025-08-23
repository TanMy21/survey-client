import type { SingleChoiceListItemProps } from "@/types/responseTypes";

const SingleChoiceListItem = ({ response, selected, onSelect }: SingleChoiceListItemProps) => {
  return (
    <div
      onClick={onSelect}
      className="mx-auto mb-1.5 flex min-h-[72px] w-full flex-row items-center gap-2 rounded-4xl border border-gray-300 bg-[#f8f9fc] p-2 shadow-[8px_8px_24px_#e0e0e0,-8px_-8px_24px_#ffffff] transition-shadow duration-200 hover:bg-[#f5f7ff] hover:shadow-[0_4px_12px_rgba(80,84,255,0.12)] md:min-h-[64px]"
    >
      <div className="ml-2 flex scale-125 items-center justify-center text-[#CFD3D9]">
        <input
          type="radio"
          checked={selected}
          onChange={onSelect}
          className="h-5 w-5 appearance-none rounded-full border-2 border-[#CFD3D9] bg-transparent checked:border-[6px] checked:border-[#005BC4] hover:bg-transparent focus:outline-none"
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

export default SingleChoiceListItem;
