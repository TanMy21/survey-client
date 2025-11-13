import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import type { InputResponseProps } from "@/types/responseTypes";
import { numberResponseSchema } from "@/utils/validationSchema";
import { useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const InputResponseNumber = ({
  inputPlaceholder,
  submitButtonText,
  question,
  surveyID,
}: InputResponseProps) => {
  const isRequired = useQuestionRequired(question);
  const [number, setNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { onSubmitAnswer } = useFlowRuntime();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();
  const { handleFirstInteraction, handleClick, handleTyping, handlePaste, markSubmission, collectBehaviorData } =
    useBehavior();
  const { setResponse } = useResponseRegistry();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    
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

    setNumber(value);
  };

  const handlePasteEvent = () => {
    handlePaste();
  };

  const handleSubmit = async () => {
 const trimmed = number.trim();
    const result = numberResponseSchema.safeParse({ number: trimmed });

    
    if (isRequired && trimmed === "") {
      setError("Your response is required for this question");
      return;
    }

     
    if (!result.success) {
      setError(result.error.format().number?._errors[0] ?? "Invalid input");
      return;
    }

     
    if (!question?.questionID || !deviceID) {
      setError("Missing identifiers. Please reload and try again.");
      return;
    }

    setError(null);

     
    handleFirstInteraction();  
    handleClick();  
    markSubmission();

    
    const behavior = collectBehaviorData();
    console.log("📦 Number input behavior data:", behavior);
    console.log("Input submitted:", trimmed);

    
    await mutateAsync({
      surveyID,
      questionID: question.questionID,
      qType: question.type,
      optionID: null,
      response: trimmed,
      deviceID,
      behavior,
    });

    
    setResponse(question.questionID, true);
     
    onSubmitAnswer(trimmed);
    
    setNumber("");
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
    <div className="flex w-full origin-bottom flex-col sm:w-[92%]">
      <div className="mx-auto flex h-[40%] w-[98%] flex-col">
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
          className={`mx-auto block h-16 w-[100%] border-0 border-b border-gray-300 px-4 text-[24px] leading-none text-black placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none md:w-[56%] md:text-[36px]`}
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

export default InputResponseNumber;
