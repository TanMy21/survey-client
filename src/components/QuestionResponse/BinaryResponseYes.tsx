import type { BinaryResponseProps } from "@/types/responseTypes";

const BinaryResponseYes = ({
  questionID,
  responseOptionText,
  value,
  checked,
  onChange,
}: BinaryResponseProps) => {
  return (
    <div
      className={[
        "mb-1.5 flex min-h-[72px] w-[98%] flex-row items-center gap-3 rounded-4xl sm:w-[84%]",
        "border border-gray-300",
        "bg-[#f8f9fc] p-1 pl-4",
        "transition-colors duration-200",
        "hover:bg-[#f5f7ff]",
        "cursor-pointer md:min-h-[64px] md:w-full",
      ].join(" ")}
    >
      <input
        type="radio"
        name={questionID}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={[
          "h-6 w-6 appearance-none rounded-full border-2 border-[#CFD3D9] bg-transparent",
          "checked:border-[6px] checked:border-[#005BC4]",
          "hover:bg-transparent",
          "cursor-pointer outline-none focus:shadow-none focus:ring-0 focus:outline-none",
          "focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none",
        ].join(" ")}
      />

      <div className="flex-1 cursor-text text-2xl leading-snug font-bold text-[#626B77] md:text-base">
        {responseOptionText}
      </div>
    </div>
  );
};

const BinaryResponseNo = BinaryResponseYes;

export { BinaryResponseYes, BinaryResponseNo };
