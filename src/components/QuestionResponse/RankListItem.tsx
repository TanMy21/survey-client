import type { RankListItemProps } from "@/types/responseTypes";
import { GripVertical } from "lucide-react";

const RankListItem = ({ response, index }: RankListItemProps) => {
  return (
    <div className="mx-auto mb-1.5 flex min-h-[64px] w-[92%] flex-row flex-wrap items-center gap-2 rounded-2xl border border-gray-300 bg-[#f8f9fc] p-1 shadow-[8px_8px_24px_#e0e0e0,-8px_-8px_24px_#ffffff] transition-shadow duration-200 hover:bg-[#f5f7ff] hover:shadow-[0_4px_12px_rgba(80,84,255,0.12)] md:w-full">
      <div className="ml-1 flex items-center">
        <GripVertical size={20} style={{ color: "#6D7584" }} />
      </div>

      <div className="flex max-w-[92%] min-w-0 flex-1 items-center overflow-auto break-words md:max-w-full">
        <div className="max-w-full min-w-0 flex-1 rounded px-1 py-1 text-[14px] font-bold text-[#626B77] md:text-[16px]">
          {response.text}
        </div>
      </div>
    </div>
  );
};

export default RankListItem;
