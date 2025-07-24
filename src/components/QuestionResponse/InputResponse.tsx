import type { InputResponseProps } from "@/types/response";

const InputResponse = ({ inputPlaceholder, submitButtonText }: InputResponseProps) => {
  return (
    <div className="flex w-full origin-bottom flex-col">
      <div className="mx-auto flex h-[60%] w-[96%] flex-col">
        {/* Input field */}
        <input
          type="text"
          placeholder={inputPlaceholder}
          className={`mx-auto block h-16 w-[92%] border-0 border-b border-gray-300 px-4 text-[24px] leading-none placeholder-[#A6A4B7] hover:border-gray-300 focus:border-gray-600 focus:outline-none md:w-[56%] md:text-[36px]`}
        />

        {/* Submit Button container */}
        <div className="mx-auto mt-4 flex h-[25%] w-[96%] flex-col items-end pr-[4%] md:w-[60%]">
          <button
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
