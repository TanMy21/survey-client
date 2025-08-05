import type { PositionedBlockProps } from "@/types/layout";

export const PositionedBlock = ({ children, className = "" }: PositionedBlockProps) => {
  return (
    <div className={`flex w-full flex-col items-center border-2 border-red-500 p-4 ${className}`}>
      {children}
    </div>
  );
};
