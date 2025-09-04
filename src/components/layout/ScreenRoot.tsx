import type { ScreenRootProps } from "@/types/layoutTypes";

const ScreenRoot = ({ children, className = "" }: ScreenRootProps) => {
  return (
    <div
      className={`mx-auto flex min-h-screen w-full flex-col items-center p-1 sm:w-[98%] sm:p-3 md:w-[96%] md:p-4 lg:w-[84%] xl:w-[78%] 2xl:w-[72%] ${className}`}
    >
      {children}
    </div>
  );
};

export default ScreenRoot;
