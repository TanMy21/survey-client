import type { PositionedBlockProps } from "@/types/layoutTypes";

export const ResponseContainer = ({ children, className = "" }: PositionedBlockProps) => {
  return <div className={`flex w-full min-w-0 flex-col items-center ${className}`}>{children}</div>;
};
