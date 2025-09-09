import type { PositionedBlockProps } from "@/types/layoutTypes";

export const ResponseContainer = ({ children, className = "" }: PositionedBlockProps) => {
  return (
    <div className={`flex w-full flex-col items-center p-1 sm:mt-0 md:mt-[-2%] sm:p-3 md:p-4 ${className}`}>
      {children}
    </div>
  );
};
