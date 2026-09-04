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
import { useRegisterQuestionSubmit } from "@/context/QuestionNavigationContext";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const InputResponse = ({
  surveyID,
  inputPlaceholder,
  submitButtonText,
  question,
}: InputResponseProps) => {
  const [error, setError] = useState<string | null>(null);
  const { markAnswered, setRealTimeResponse } = useResponseRegistry();
  const { mutateAsync, isPending } = useSubmitEmailResponse();
  const { goNext } = useFlowRuntime();
  const deviceID = useDeviceId();

  const {
    value: email,
    setValue: setText,
    hydrated,
    clearHydration,
  } = useHydratedResponse<string>({
    question: question!,
    defaultValue: "",
    mapPersisted: (p) => {
      if (typeof p.value === "string") return p.value;
      return "";
    },
  });

  const {
    handleFirstInteraction,
    handleClick,
    handleTyping,
    handlePaste,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const isRequired = useQuestionRequired(question, email.trim() !== "");

  const handleSubmit = () => {
    if (isPending) return;

    const trimmed = email.trim();
    const result = elementSchema.safeParse({ emailContact: trimmed });

    if (isRequired && trimmed === "") {
      setError("Your response is required for this question");
      return;
    }

    if (hydrated && question) {
      markAnswered(question.questionID);
      goNext();
      return;
    }

    if (!result.success) {
      setError(result.error.format().emailContact?._errors[0] ?? "Invalid input");
      return;
    }

    if (!deviceID || !question?.questionID) {
      setError("Missing identifiers. Please reload and try again.");
      return;
    }

    setError(null);

    handleFirstInteraction();
    handleClick();
    markSubmission();
    markAnsweredEvent();

    const behavior = collectBehaviorData();

    mutateAsync(
      {
        surveyID,
        deviceID,
        questionID: question.questionID,
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

    setRealTimeResponse(question.questionID, email!, null);
  };

  useRegisterQuestionSubmit(isRequired || email.trim() !== "", handleSubmit);

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  const handleBlur = () => {
    const trimmed = email.trim();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value !== email) {
      clearHydration();
    }

    const native = e.nativeEvent as InputEvent | undefined;
    const inputType = native?.inputType;

    if (inputType === "deleteContentBackward") {
      handleTyping("Backspace");
    } else {
      const lastChar = value.slice(-1);
      if (lastChar) {
        handleTyping(lastChar);
      }
    }

    setText(value);
  };

  return (
    <div className="flex w-[92%] origin-bottom flex-col md:ml-[1%] md:w-[98%] md:max-w-[560px] md:self-start">
      <div className="flex h-[60%] w-full flex-col">
        {/* Input field */}
        <input
          type="text"
          placeholder={inputPlaceholder}
          value={email || ""}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={handleFirstInteraction}
          onPaste={handlePaste}
          onChange={handleChange}
          className="block h-12 w-full border-0 border-b border-gray-300 px-0 text-left text-base text-black placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none sm:h-14 sm:text-lg md:h-16 md:text-2xl lg:h-20 lg:text-3xl"
        />

        {/* Error message */}
        {error && <InputError error={error} className="md:!mx-0 md:!w-full md:!px-0" />}

        {/* Submit Button container */}
        <div className="mx-auto mt-4 hidden h-[25%] w-[96%] flex-col items-end pr-[4%] md:mx-0 md:flex md:w-full md:pr-0">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-[80px] rounded-4xl bg-[#005BC4] px-2 py-1 text-base font-bold text-white capitalize transition hover:bg-[#005BC4] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2"
          >
            {isPending ? "..." : submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputResponse;
