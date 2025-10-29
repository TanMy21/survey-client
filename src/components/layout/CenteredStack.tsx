import { useIsMobile } from "@/hooks/useIsMobile";
import type { CenteredStackProps } from "@/types/layoutTypes";

const CenteredStack = ({ children, className = "", marginTopOverride }: CenteredStackProps) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`mx-auto mt-[8%] mb-[2%] flex w-[80%] max-w-[80%] items-start gap-2 border-2 border-black transition-all duration-300 md:gap-3 ${className}`}
      style={{
        width: isMobile ? "98%" : "80%",
        maxWidth: isMobile ? "98%" : "80%",
        marginTop: marginTopOverride ?? "8%",
      }}
    >
      {children}
    </div>
  );
};
export default CenteredStack;
