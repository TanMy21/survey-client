import { useIsMobile } from "@/hooks/useIsMobile";
import type { ScreenRootProps } from "@/types/layoutTypes";

const ScreenRoot = ({ children, className = "" }: ScreenRootProps) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`z-20 mx-auto flex min-h-screen w-full flex-col items-center justify-center border-2 border-red-500 p-1 transition-all duration-300 sm:w-[100%] sm:p-1 md:w-[96%] md:p-4 lg:w-[84%] xl:w-[78%] 2xl:w-[72%] ${className}`}
      style={{
        width: isMobile ? "98%" : "80%",
      }}
    >
      {children}
    </div>
  );
};

export default ScreenRoot;
