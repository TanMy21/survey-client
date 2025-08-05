import { useRequiredAlert } from "@/context/RequiredAlertContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { InputResponseProps } from "@/types/response";
import { textResponseSchema } from "@/utils/validationSchema";
import { useState } from "react";

const InputResponseText = ({
  inputPlaceholder,
  submitButtonText,
  question,
  setCurrentQuestionIndex,
}: InputResponseProps) => {
  const isRequired = useQuestionRequired(question);
  const { showAlert } = useRequiredAlert();

  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const result = textResponseSchema.safeParse({ text });

    if (isRequired && !result.success) {
      showAlert();
      return;
    }

    if (!result.success) {
      const errorMessage = result.error.format().text?._errors?.[0] ?? "Invalid input";
      setError(errorMessage);
    } else {
      setError(null);
      console.log("Submitted response:", text);
      setText(""); // Clear input
      setCurrentQuestionIndex?.((i) => i + 1);
    }
  };

  return (
    <div className="flex w-3/5 origin-bottom flex-col border-2 border-amber-600">
      <div className="mx-auto flex h-[60%] w-[96%] flex-col border-2 border-b-emerald-400">
        {/* Input field  */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={inputPlaceholder}
          rows={1}
          className="scrollbar-hidden mx-auto block max-h-64 min-h-16 w-[92%] resize-none overflow-y-auto border-0 border-b border-gray-300 px-4 text-[24px] leading-tight text-black placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none md:w-[56%] md:text-[36px]"
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Error Message */}
        {error && <div className="mt-1 w-full px-4 text-sm text-red-600 md:w-[56%]">{error}</div>}

        {/* Submit Button */}
        <div className="mx-auto mt-4 flex h-[25%] w-[96%] flex-col items-end pr-[4%] md:w-[60%]">
          <button
            onClick={handleSubmit}
            className="w-[120px] rounded-4xl bg-[#005BC4] px-2 py-1 text-base font-bold text-white capitalize transition hover:bg-[#004aad] md:w-1/5 md:px-4 md:py-2"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputResponseText;
