import type { BinaryResponseContainerProps } from "@/types/response";

import BinaryResponseYes, { BinaryResponseNo } from "./BinaryResponseYes";
import { useState } from "react";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { InputError } from "../alert/ResponseErrorAlert";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";

const BinaryResponseContainer = ({
  question,
  setCurrentQuestionIndex,
  setCanProceed,
}: BinaryResponseContainerProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { questionID, questionPreferences } = question;
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);
  const buttonTextYes = questionPreferences.uiConfig?.buttonTextYes || "Yes";
  const buttonTextNo = questionPreferences.uiConfig?.buttonTextNo || "No";

  const handleSubmit = () => {
    if (isRequired && selectedValue === null) {
      setError("Your response is required for this question");
      return;
    }

    console.log("Selected response:", selectedValue);
    setCanProceed?.(true);
    setCurrentQuestionIndex?.((i) => i + 1);
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  return (
    <div className="mx-auto flex h-full w-3/5 flex-col items-center justify-center gap-2 border-2 border-amber-500 p-2">
      <div
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Binary response container"
        className="flex h-full w-[98%] flex-col gap-2 border-2 border-blue-500 md:w-4/5"
      >
        <div className="mx-auto flex h-full w-[80%] flex-col gap-2 border-2 border-amber-400">
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
        </div>

        {/* Error message */}
        {error && <InputError error={error} />}

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
