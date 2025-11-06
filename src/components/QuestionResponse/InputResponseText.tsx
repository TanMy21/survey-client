import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { InputResponseProps } from "@/types/responseTypes";
import { textResponseSchema } from "@/utils/validationSchema";
import { useEffect, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const InputResponseText = ({
  inputPlaceholder,
  submitButtonText,
  question,
}: InputResponseProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);
  const deviceID = useDeviceId();
  const { setResponse } = useResponseRegistry();
  const { mutateAsync, isPending } = useSubmitResponse();
  const { onSubmitAnswer } = useFlowRuntime();

  const {
    handleFirstInteraction,
    handleBacktrack,
    handleTyping,
    handlePaste,
    handleClick,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSubmit = async () => {
    const trimmed = text.trim();
    const result = textResponseSchema.safeParse({ text: trimmed });

    if (isRequired && trimmed === "") {
      setError("Your response is required for this question");
      return;
    }

    if (!question?.questionID || !deviceID) return;

    if (!result.success) {
      const errorMessage = result.error.format().text?._errors?.[0] ?? "Invalid input";
      setError(errorMessage);
    } else {
      setError(null);
      handleClick();
      markSubmission();
      const behavior = collectBehaviorData();
      console.log("📦 TextScreen behavior data:", behavior);
      console.log("Submitted response:", text);
      await mutateAsync({
        questionID: question.questionID,
        qType: question.type,
        optionID: null,
        response: text,
        deviceID,
        behavior,
      });


      setResponse(question.questionID, true);
      onSubmitAnswer(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;
    if (key === "Backspace" || key.length === 1) {
      handleTyping(key);
    }

    if (key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBlur = () => {
    const trimmed = text.trim();

    if (trimmed === "") {
      if (isRequired) {
        setError("This field is required.");
      }
      return;
    }

    const result = textResponseSchema.safeParse({ text: trimmed });
    if (!result.success) {
      setError(result.error.format().text?._errors[0] ?? "Invalid email format");
    } else {
      setError(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    handleTyping(newValue);
    setText(newValue);
  };

  const handlePasteEvent = () => {
    handlePaste();
  };

  useEffect(() => {
    handleBacktrack();
  }, []);

  return (
    <div className="flex w-full origin-bottom flex-col sm:w-[92%]">
      <div className="mx-auto flex h-[60%] w-[100%] flex-col">
        {/* Input field  */}
        <textarea
          value={text}
          onChange={handleChange}
          onPaste={handlePasteEvent}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFirstInteraction}
          placeholder={inputPlaceholder}
          rows={1}
          className="scrollbar-hidden mx-auto block max-h-64 min-h-16 w-[98%] resize-none overflow-y-auto border-0 border-b border-gray-300 px-4 text-[24px] leading-tight text-black placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none md:w-[56%] md:text-[36px]"
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Error message */}
        {error && <InputError error={error} />}

        {/* Submit Button */}
        <div className="mx-auto mt-4 flex h-[25%] w-[96%] flex-col items-end pr-[4%] md:w-[60%]">
          <button
            onClick={handleSubmit}
            className="w-[80px] rounded-4xl bg-[#005BC4] px-2 py-1 text-base font-bold text-white capitalize transition hover:bg-[#004aad] md:px-4 md:py-2"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputResponseText;
