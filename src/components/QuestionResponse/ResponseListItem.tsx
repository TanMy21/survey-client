import type { ResponseListItemProps } from "@/types/response";

const ResponseListItem = ({ qType, response, index }: ResponseListItemProps) => {
  return (
    <div className="mx-auto mb-1.5 flex w-[100%] min-h-[72px] md:min-h-[64px] flex-row flex-wrap items-center gap-2 rounded-4xl border border-gray-300 bg-[#f8f9fc] p-2 shadow-[8px_8px_24px_#e0e0e0,-8px_-8px_24px_#ffffff] transition-shadow duration-200 hover:bg-[#f5f7ff] hover:shadow-[0_4px_12px_rgba(80,84,255,0.12)] md:w-full">
      {qType === "RADIO" && (
        <div className="ml-1 scale-125 text-[#CFD3D9]">
          <input type="radio" className="appearance-none" disabled />
        </div>
      )}

      {qType === "MULTIPLE_CHOICE" && (
        <div className="ml-1 scale-125 text-[#CFD3D9]">
          <input type="checkbox" className="appearance-none rounded" disabled />
        </div>
      )}

      {(qType === "INSTRUCTIONS" || qType === "RANK") && (
        <div className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <span className="font-medium">{index + 1}</span>
        </div>
      )}

      <div className="overflow-wrap-anywhere max-w-full min-w-0 flex-1 break-words">
        <div className="max-w-full min-w-0 flex-1 cursor-text rounded px-1 py-1 text-sm font-bold text-[#626B77] md:text-base">
          {response.text}
        </div>
      </div>
    </div>
  );
};

export default ResponseListItem;
