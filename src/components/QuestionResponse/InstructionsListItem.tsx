import type { ResponseListItemProps } from "@/types/response";

const InstructionsListItem = ({ response, index }: ResponseListItemProps) => {
  return (
    <div className="mx-auto mb-1.5 flex min-h-[72px] w-[100%] flex-row flex-wrap items-center gap-2 rounded-4xl border border-gray-300 bg-[#f8f9fc] p-2 shadow-[8px_8px_24px_#e0e0e0,-8px_-8px_24px_#ffffff] transition-shadow duration-200 hover:bg-[#f5f7ff] hover:shadow-[0_4px_12px_rgba(80,84,255,0.12)] md:min-h-[64px] md:w-full">
      <div className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <span className="font-medium">{index + 1}</span>
      </div>

      <div className="overflow-wrap-anywhere max-w-full min-w-0 flex-1 break-words">
        <div className="max-w-full min-w-0 flex-1 rounded px-1 py-1 text-sm font-bold text-[#626B77] md:text-base">
          {response.text}
        </div>
      </div>
    </div>
  );
};

export default InstructionsListItem;
