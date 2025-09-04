import type { PositionedBlockProps } from "@/types/layoutTypes";

export const ResponseContainer = ({ children, className = "" }: PositionedBlockProps) => {
  return (
    <div
      className={`flex w-full flex-col items-center border-2 border-red-500 p-1 sm:mt-0 sm:p-3 md:p-4 ${className}`}
    >
      {children}
    </div>
  );
};
