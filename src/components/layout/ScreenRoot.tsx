import type { ScreenRootProps } from "@/types/layoutTypes";

const ScreenRoot = ({ children, className = "" }: ScreenRootProps) => {
  return (
    <div className={`z-20 box-border flex min-h-0 w-full flex-1 flex-col ${className}`}>
      <div className="my-auto box-border flex w-full flex-col items-center px-5 py-8 md:px-10 md:py-12">
        <div className="flex w-full max-w-[860px] flex-col items-center">{children}</div>
      </div>
    </div>
  );
};

export default ScreenRoot;
