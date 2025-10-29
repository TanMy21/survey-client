import { useIsMobile } from "@/hooks/useIsMobile";
import type { PositionedBlockProps } from "@/types/layoutTypes";

export const ResponseContainer = ({ children, className = "" }: PositionedBlockProps) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`mx-auto mt-[2%] mb-[4%] flex w-[80%] max-w-[80%] flex-col items-center rounded-md border border-gray-300 px-2 py-2 transition-all duration-300 sm:w-[92%] sm:max-w-[92%] md:px-1 md:py-1 ${className}`}
      style={{ width: isMobile ? "98%" : "80%", maxWidth: isMobile ? "98%" : "80%" }}
    >
      {children}
    </div>
  );
};
