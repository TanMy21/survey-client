import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { InputResponseProps } from "@/types/responseTypes";
import { elementSchema } from "@/utils/validationSchema";
import { useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitEmailResponse } from "@/hooks/useSurvey";

const InputResponse = ({ inputPlaceholder, submitButtonText, question }: InputResponseProps) => {
  const [emailContact, setEmailContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);
  const { mutate, isPending } = useSubmitEmailResponse();
  const { goNext } = useFlowRuntime();
  const deviceID = useDeviceId();

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
      mutate(
        {
          deviceID,
          questionID: question?.questionID || "",
          email: result.data.emailContact,
          behavior,
        },
        {
          onSuccess: () => {
            goNext();
          },
          onError: (err) => {
            setError(err.message || "Failed to submit. Please try again.");
          },
        }
      );
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
    <div className="flex w-4/5 origin-bottom flex-col">
      <div className="mx-auto flex h-[60%] w-[100%] flex-col">
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
          className={`lg:w-4/5lg:text-3xl mx-auto block h-12 w-full border-0 border-b border-gray-300 px-3 text-base text-black placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none sm:h-14 sm:w-4/5 sm:text-lg md:h-16 md:w-3/5 md:text-2xl lg:h-20`}
        />

        {/* Error message */}
        {error && <InputError error={error} />}

        {/* Submit Button container */}
        <div className="mx-auto mt-4 flex h-[25%] w-[96%] flex-col items-end pr-[4%] md:w-[60%]">
          <button
            onClick={handleSubmit}
            className={`w-[80px] rounded-4xl bg-[#005BC4] px-2 py-1 text-base font-bold text-white capitalize transition hover:bg-[#005BC4] md:px-4 md:py-2`}
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputResponse;
