import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { InputResponseProps } from "@/types/responseTypes";
import { numberResponseSchema } from "@/utils/validationSchema";
import { useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";

const InputResponseNumber = ({
  inputPlaceholder,
  submitButtonText,
  setCurrentQuestionIndex,
  question,
}: InputResponseProps) => {
  const isRequired = useQuestionRequired(question);
  const [number, setNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { handleFirstInteraction, handleTyping, handlePaste, markSubmission, collectBehaviorData } =
    useBehavior();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleTyping(newValue);
    setNumber(newValue);
  };

  const handlePasteEvent = () => {
    handlePaste();
  };

  const handleSubmit = () => {
    const trimmed = number.trim();
    const result = numberResponseSchema.safeParse({ number: trimmed });

    if (isRequired && !result.success) {
      setError("Your response is required for this question");
      return;
    }

    if (!result.success) {
      setError(result.error.format().number?._errors[0] ?? "Invalid input");
    } else {
      setError(null);

      markSubmission();
      const data = collectBehaviorData();
      console.log("📦 Number input behavior data:", data);
      console.log("Input submitted:", number);
      setCurrentQuestionIndex?.((i) => i + 1);
    }
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const handleBlur = () => {
    const trimmed = number.trim();

    if (trimmed === "") {
      if (isRequired) {
        setError("This field is required.");
      }
      return;
    }

    const result = numberResponseSchema.safeParse({ number: trimmed });
    if (!result.success) {
      setError(result.error.format().number?._errors[0] ?? "Invalid email format");
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex w-3/5 origin-bottom flex-col border-2 border-amber-600">
      <div className="mx-auto flex h-[60%] w-[96%] flex-col border-2 border-b-emerald-400">
        {/* Input field */}
        <input
          type="number"
          placeholder={inputPlaceholder}
          value={number}
          onChange={handleChange}
          onPaste={handlePasteEvent}
          onFocus={handleFirstInteraction}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`mx-auto block h-16 w-[92%] border-0 border-b border-gray-300 px-4 text-[24px] leading-none text-black placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none md:w-[56%] md:text-[36px]`}
        />

        {/* Error message */}
        {error && <InputError error={error} />}

        {/* Submit Button container */}
        <div className="mx-auto mt-4 flex h-[25%] w-[96%] flex-col items-end pr-[4%] md:w-[60%]">
          <button
            onClick={handleSubmit}
            className={`w-[120px] rounded-4xl bg-[#005BC4] px-2 py-1 text-base font-bold text-white capitalize transition hover:bg-[#005BC4] md:w-1/5 md:px-4 md:py-2`}
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputResponseNumber;
