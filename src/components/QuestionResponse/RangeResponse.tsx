import type { RangeResponseProps } from "@/types/response";
import ProgressiveSlider from "./ProgressiveSlider";
import ScaleCounter from "./ScaleCounter";
import { useIsMobile } from "@/hooks/useIsMobile";

const RangeResponse = ({ question }: RangeResponseProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="w-4/5 p-2 sm:p-3 md:p-4 xl:p-6">
      {isMobile ? <ScaleCounter question={question} /> : <ProgressiveSlider question={question} />}
    </div>
  );
};

export default RangeResponse;
