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
  const isRequired = useQuestionRequired(question);
  const { markAnswered, setRealTimeResponse } = useResponseRegistry();
  const { mutateAsync, isPending } = useSubmitEmailResponse();
  const { goNext, onSubmitAnswer } = useFlowRuntime();
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

  const handleSubmit = () => {
    const trimmed = email.trim();
    const result = elementSchema.safeParse({ emailContact: trimmed });

    if (isRequired && trimmed === "") {
      setError("Your response is required for this question");
      return;
    }

    if (hydrated && question) {
      markAnswered(question.questionID);
      onSubmitAnswer(trimmed);
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
    <div className="flex w-4/5 origin-bottom flex-col">
      <div className="mx-auto flex h-[60%] w-[100%] flex-col">
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
