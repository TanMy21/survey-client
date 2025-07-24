import type { BinaryResponseProps } from "@/types/response";

const BinaryResponseYes = ({ questionID, responseOptionText, index }: BinaryResponseProps) => {
  return (
    <div className="mb-1.5 flex min-h-[72px] w-[84%] flex-row items-center gap-3 rounded-4xl border border-gray-300 bg-[#f8f9fc] p-1 pl-4 shadow-[8px_8px_24px_#e0e0e0,-8px_-8px_24px_#ffffff] transition-shadow duration-200 hover:bg-[#f5f7ff] hover:shadow-[0_4px_12px_rgba(80,84,255,0.12)] md:min-h-[64px] md:w-full">
      <input
        type="radio"
        className="h-5 w-5 appearance-none rounded-full border-2 border-[#CFD3D9] bg-transparent checked:border-[6px] checked:border-[#005BC4] hover:bg-transparent focus:outline-none"
      />

      <div className="flex-1 cursor-text text-2xl leading-snug font-bold text-[#626B77] md:text-base">
        {responseOptionText}
      </div>
    </div>
  );
};

export default BinaryResponseYes;
