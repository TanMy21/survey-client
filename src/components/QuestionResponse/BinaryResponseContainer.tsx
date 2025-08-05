import type { BinaryResponseContainerProps } from "@/types/response";

import BinaryResponseYes, { BinaryResponseNo } from "./BinaryResponseYes";
import { useState } from "react";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useRequiredAlert } from "@/context/RequiredAlertContext";

const BinaryResponseContainer = ({
  question,
  setCurrentQuestionIndex,
  setCanProceed,
}: BinaryResponseContainerProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { questionID, questionPreferences } = question;
  const isRequired = useQuestionRequired(question);
  const { showAlert } = useRequiredAlert();
  const buttonTextYes = questionPreferences.uiConfig?.buttonTextYes || "Yes";
  const buttonTextNo = questionPreferences.uiConfig?.buttonTextNo || "No";

  const handleSubmit = () => {
    if (isRequired && selectedValue === null) {
      showAlert();
      return;
    }

    console.log("Selected response:", selectedValue);
    setCanProceed?.(true);
    setCurrentQuestionIndex?.((i) => i + 1);
  };

  return (
    <div className="mx-auto flex h-full w-2/5 flex-col items-center justify-center gap-2 border-2 border-amber-500 p-2">
      <div className="flex h-full w-[98%] flex-col gap-2 border-2 border-blue-500 md:w-4/5">
        <BinaryResponseYes
          questionID={questionID}
          responseOptionText={buttonTextYes}
          index={0}
          value="YES"
          checked={selectedValue === "YES"}
          onChange={setSelectedValue}
        />
        <BinaryResponseNo
          questionID={questionID}
          responseOptionText={buttonTextNo}
          index={1}
          value="NO"
          checked={selectedValue === "NO"}
          onChange={setSelectedValue}
        />

        <div className="mt-4 flex w-full justify-end pr-6">
          <button
            onClick={handleSubmit}
            className="min-w-[120px] rounded-[16px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinaryResponseContainer;
