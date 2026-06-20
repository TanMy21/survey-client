import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { InputResponseProps } from "@/types/responseTypes";
import { numberResponseSchema } from "@/utils/validationSchema";
import { useEffect, useMemo, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useRegisterQuestionSubmit } from "@/context/QuestionNavigationContext";
import { getFiniteNumber, getNumberRangeError } from "@/utils/utils";


 
const InputResponseNumber = ({
  inputPlaceholder,
  submitButtonText,
  question,
  surveyID,
}: InputResponseProps) => {
  const isRequired = useQuestionRequired(question);
  const [error, setError] = useState<string | null>(null);

  const { markTouched, markAnswered, setRealTimeResponse } =
    useResponseRegistry();

  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();

  const {
    handleFirstInteraction,
    handleClick,
    handleTyping,
    handlePaste,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const {
    value: number,
    setValue: setNumber,
    hydrated,
    clearHydration,
  } = useHydratedResponse<string>({
    question: question!,
    defaultValue: "",
    mapPersisted: (persisted) => String(persisted.value ?? ""),
  });

  /**
   * Extracts configured numeric limits from the saved question UI configuration.
   */
  const { minValue, maxValue } = useMemo(() => {
    const uiConfig = question?.questionPreferences?.uiConfig ?? {};

    return {
      minValue: getFiniteNumber(uiConfig.minValue),
      maxValue: getFiniteNumber(uiConfig.maxValue),
    };
  }, [question?.questionPreferences?.uiConfig]);

  /**
   * Validates the response format and configured numeric range.
   */
  const validateNumberResponse = (value: string): string | null => {
    const trimmed = value.trim();

    const schemaResult = numberResponseSchema.safeParse({
      number: trimmed,
    });

    if (!schemaResult.success) {
      return (
        schemaResult.error.format().number?._errors[0] ??
        "Please enter a valid number."
      );
    }

    return getNumberRangeError({
      value: trimmed,
      minValue,
      maxValue,
    });
  };

  /**
   * Updates the current input value, captures typing behavior,
   * and clears an existing range error once the value becomes valid.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value !== number) {
      clearHydration();
    }

    markTouched(question?.questionID!);

    const nativeEvent = event.nativeEvent as InputEvent | undefined;
    const inputType = nativeEvent?.inputType;

    if (inputType === "deleteContentBackward") {
      handleTyping("Backspace");
    } else {
      const lastCharacter = value.slice(-1);

      if (lastCharacter) {
        handleTyping(lastCharacter);
      }
    }

    setNumber(value);

    if (hydrated) {
      clearHydration();
    }

    // Clear or update the message while the participant corrects their answer.
    if (value.trim() === "") {
      setError(null);
      return;
    }

    const rangeError = getNumberRangeError({
      value,
      minValue,
      maxValue,
    });

    setError(rangeError);
  };

  /**
   * Tracks paste behavior and treats a pasted response as user-edited content.
   */
  const handlePasteEvent = () => {
    handlePaste();

    if (hydrated) {
      clearHydration();
    }
  };

  /**
   * Validates the answer and submits it when it satisfies required, format,
   * and configured min/max rules.
   */
  const handleSubmit = async () => {
    const trimmed = number?.trim() ?? "";

    if (!question?.questionID || !deviceID) {
      setError("Missing identifiers. Please reload and try again.");
      return;
    }

    if (isRequired && trimmed === "") {
      setError("Your response is required for this question.");
      return;
    }

    // Optional blank number responses can proceed without parsing.
    if (trimmed === "") {
      setError(null);
      markAnswered(question.questionID);
      setRealTimeResponse(question.questionID, "", null);
      onSubmitAnswer("");
      return;
    }

    const validationError = validateNumberResponse(trimmed);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    // A hydrated answer is already persisted, but still receives range validation above.
    if (hydrated) {
      markAnswered(question.questionID);
      onSubmitAnswer(trimmed);
      return;
    }

    handleFirstInteraction();
    handleClick();
    markSubmission();
    markAnsweredEvent();
    markAnswered(question.questionID);

    const behavior = collectBehaviorData();

    await mutateAsync({
      surveyID,
      questionID: question.questionID,
      qType: question.type,
      optionID: null,
      response: trimmed,
      deviceID,
      behavior,
    });

    setRealTimeResponse(question.questionID, trimmed, null);
    onSubmitAnswer(trimmed);
  };

  /**
   * Registers the question's submit handler with the survey flow.
   */
  useRegisterQuestionSubmit(
    isRequired || (number ?? "").trim() !== "",
    handleSubmit,
  );

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  /**
   * Shows validation feedback when the participant leaves the input.
   */
  const handleBlur = () => {
    const trimmed = number?.trim() ?? "";

    if (trimmed === "") {
      setError(
        isRequired ? "Your response is required for this question." : null,
      );
      return;
    }

    setError(validateNumberResponse(trimmed));
  };

  /**
   * Marks an already-persisted response as answered when the survey restores it.
   */
  useEffect(() => {
    if (hydrated && number !== "") {
      markAnswered(question?.questionID!);
    }
  }, [hydrated, number, question?.questionID, markAnswered]);

  return (
    <div className="flex w-full origin-bottom flex-col sm:w-[92%]">
      <div className="mx-auto flex h-[40%] w-[98%] flex-col">
        {/* Browser min/max constraints complement the application-level validation. */}
        <input
          type="number"
          min={minValue}
          max={maxValue}
          step="any"
          placeholder={inputPlaceholder}
          value={number ?? ""}
          onChange={handleChange}
          onPaste={handlePasteEvent}
          onFocus={handleFirstInteraction}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "number-input-error" : undefined}
          className={`mx-auto block h-16 w-full border-0 border-b px-4 text-[24px] leading-none text-black placeholder-[#A6A4B7] focus:outline-none md:w-[56%] md:text-[36px] ${
            error
              ? "border-red-500 focus:border-red-600"
              : "border-gray-300 hover:border-gray-300 focus:border-gray-600"
          }`}
        />

        {/* Displays validation errors, including configured min/max violations. */}
        {error && (
          <div id="number-input-error">
            <InputError error={error} />
          </div>
        )}

        <div className="mx-auto mt-4 flex h-[25%] w-[96%] flex-col items-end pr-[4%] md:w-[60%]">
          <button
            type="button"
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

export default InputResponseNumber;
