import type { PositionedBlockProps } from "@/types/layoutTypes";

export const PositionedBlock = ({ children, className = "" }: PositionedBlockProps) => {
  return (
    <div className={`flex w-full flex-col items-center p-1 sm:p-3 md:p-4 ${className}`}>
      {children}
    </div>
  );
};
