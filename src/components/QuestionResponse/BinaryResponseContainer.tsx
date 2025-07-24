import type { BinaryResponseContainerProps } from "@/types/response";
import BinaryResponseNo from "./BinaryResponseNo";
import BinaryResponseYes from "./BinaryResponseYes";

const BinaryResponseContainer = ({ question }: BinaryResponseContainerProps) => {
  const { questionID, questionPreferences } = question;
  const buttonTextYes = questionPreferences.uiConfig?.buttonTextYes || "Yes";
  const buttonTextNo = questionPreferences.uiConfig?.buttonTextNo || "No";
  return (
    <div className="mx-auto flex h-full w-2/5 flex-col items-center justify-center gap-2 border-2 border-amber-500 p-2">
      <div className="flex h-full w-[98%] flex-col gap-2 border-2 border-blue-500 md:w-4/5">
        <BinaryResponseYes questionID={questionID} responseOptionText={buttonTextYes} index={0} />
        <BinaryResponseNo questionID={questionID} responseOptionText={buttonTextNo} index={1} />
      </div>
    </div>
  );
};

export default BinaryResponseContainer;
