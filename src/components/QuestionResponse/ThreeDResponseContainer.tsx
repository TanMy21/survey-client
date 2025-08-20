import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { ThreeDResponseContainerProps } from "@/types/response";
import { Heart, X } from "lucide-react";
import { useCallback, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";

const ThreeDResponseContainer = ({
  question,
  setCanProceed,
  setCurrentQuestionIndex,
}: ThreeDResponseContainerProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  //   const { questionID } = question;
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSubmit = useCallback(() => {
    if (isRequired && selectedValue === null) {
      setError("Your response is required for this question");
      return;
    }
    markSubmission();
    const data = collectBehaviorData();
    const three = (window as any).__r3f_collect__?.();
    console.log("📦 Three D Model behavior data:", three);
    console.log("📦 Three D Response behavior data:", data);
    console.log("Selected response:", selectedValue);
    setCanProceed?.(true);
    setCurrentQuestionIndex?.((i) => i + 1);
  }, [
    collectBehaviorData,
    isRequired,
    selectedValue,
    setCanProceed,
    setCurrentQuestionIndex,
    markSubmission,
  ]);

  const clickLike = () => {
    handleFirstInteraction();
    handleClick();
    handleOptionChange();
    setSelectedValue("LIKE");
    handleSubmit();
    setError(null);
  };
  const clickDislike = () => {
    handleFirstInteraction();
    handleClick();
    handleOptionChange();
    setSelectedValue("DISLIKE");
    handleSubmit();
    setError(null);
  };

  return (
    <div className="m-auto flex h-[80%] w-[32%] gap-4">
      {/* Dislike Button */}
      <div className="flex h-[96%] w-[48%] justify-center">
        <button
          onClick={clickDislike}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-red-600 active:scale-95"
          aria-label="delete"
        >
          <X className="h-6 w-6 font-bold" />
        </button>
      </div>

      {/* Like Button */}
      <div className="flex h-[96%] w-[48%] justify-center">
        <button
          onClick={clickLike}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-green-600 active:scale-95"
          aria-label="like"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {error && <InputError error={error} />}
    </div>
  );
};

export default ThreeDResponseContainer;
