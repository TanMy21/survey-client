import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { InputResponseProps } from "@/types/response";
import { elementSchema } from "@/utils/validationSchema";
import { useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { useBehavior } from "@/context/BehaviorTrackerContext";

const InputResponse = ({
  inputPlaceholder,
  submitButtonText,
  setCurrentQuestionIndex,
  question,
}: InputResponseProps) => {
  const [emailContact, setEmailContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);

  const {
    handleFirstInteraction,
    handleClick,
    handleTyping,
    handlePaste,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSubmit = () => {
    const trimmed = emailContact.trim();
    const result = elementSchema.safeParse({ emailContact: trimmed });

    if (isRequired && trimmed === "") {
      setError("Your response is required for this question");
      return;
    }

    if (!result.success) {
      setError(result.error.format().emailContact?._errors[0] ?? "Invalid input");
    } else {
      setError(null);
      markSubmission();
      const behavior = collectBehaviorData();

      console.log("📦 EmailContactScreen behavior data:", behavior);
      console.log("Input submitted:", result);
      setCurrentQuestionIndex?.((i) => i + 1);
    }
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const handleBlur = () => {
    const trimmed = emailContact.trim();

    if (trimmed === "") {
      if (isRequired) {
        setError("This field is required.");
      }
      return;
    }

    const result = elementSchema.safeParse({ emailContact: trimmed });
    if (!result.success) {
      setError(result.error.format().emailContact?._errors[0] ?? "Invalid email format");
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex w-3/5 origin-bottom flex-col border-2 border-amber-600">
      <div className="mx-auto flex h-[60%] w-[96%] flex-col border-2 border-b-emerald-400">
        {/* Input field */}
        <input
          type="text"
          placeholder={inputPlaceholder}
          value={emailContact}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={handleFirstInteraction}
          onPaste={handlePaste}
          onChange={(e) => {
            setEmailContact(e.target.value);
            handleTyping(e.target.value);
          }}
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

export default InputResponse;
