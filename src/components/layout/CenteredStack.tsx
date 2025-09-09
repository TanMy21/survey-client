import type { CenteredStackProps } from "@/types/layoutTypes";

const CenteredStack = ({ children, className = "" }: CenteredStackProps) => {
  return (
    <div className={`my-auto flex w-full flex-col items-center gap-8 ${className}`}>{children}</div>
  );
};
export default CenteredStack;
