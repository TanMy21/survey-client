import type { CenteredStackProps } from "@/types/layoutTypes";

const CenteredStack = ({ children, className = "" }: CenteredStackProps) => {
  return <div className={`mb-8 flex w-full min-w-0 items-start ${className}`}>{children}</div>;
};
export default CenteredStack;
