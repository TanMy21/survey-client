import { useIsMobile } from "@/hooks/useIsMobile";
import MediaOption from "./MediaOption";
import type { MediaOptionsProps } from "@/types/response";

const MediaOptionsContainer = ({ options }: MediaOptionsProps) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`grid w-3/5 px-1 ${
        isMobile ? "grid-cols-1" : "sm:grid-cols-2 md:grid-cols-3"
      } mx-auto gap-2 sm:gap-3 md:w-[96%] md:gap-6 xl:w-3/5`}
    >
      {options.map((option) => (
        <MediaOption key={option.optionID} option={option} />
      ))}
    </div>
  );
};

export default MediaOptionsContainer;
