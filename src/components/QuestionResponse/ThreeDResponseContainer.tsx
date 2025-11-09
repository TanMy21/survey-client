import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { ThreeDResponseContainerProps } from "@/types/responseTypes";
import { Heart, X } from "lucide-react";
import { useCallback, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const ThreeDResponseContainer = ({ question }: ThreeDResponseContainerProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { questionID, type } = question;
  const [error, setError] = useState<string | null>(null);
  const isRequired = useQuestionRequired(question);
  const { onSubmitAnswer } = useFlowRuntime();
  const { setResponse } = useResponseRegistry();
  const deviceID = useDeviceId();
  const { mutateAsync, isPending } = useSubmitResponse();

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

  const handleSubmit = useCallback(
    async (value: "LIKE" | "DISLIKE") => {
      if (isRequired && value == null) return;
      if (!deviceID || !questionID) return;

      markSubmission();

      const data = collectBehaviorData();
      const three = (window as any).__r3f_collect__?.();
      console.log("📦 Three D Model behavior data:", three);
      console.log("📦 Three D Response behavior data:", data);
      console.log("Selected response:", value);

      await mutateAsync({
        deviceID,
        questionID,
        optionID: null,
        qType: type,
        response: value,
        behavior: data,
      });

      setResponse(questionID, true);

      onSubmitAnswer(value);
    },
    [
      collectBehaviorData,
      deviceID,
      questionID,
      type,
      isRequired,
      mutateAsync,
      markSubmission,
      onSubmitAnswer,
    ]
  );

  const clickLike = () => {
    handleFirstInteraction();
    handleClick();
    if (selectedValue !== "LIKE") {
      handleOptionChange();
    }
    setSelectedValue("LIKE");
    void handleSubmit("LIKE");
    setError(null);
  };
  const clickDislike = () => {
    handleFirstInteraction();
    handleClick();
    if (selectedValue !== "DISLIKE") {
      handleOptionChange();
    }
    setSelectedValue("DISLIKE");
    void handleSubmit("DISLIKE");
    setError(null);
  };

  return (
    <div className="m-auto mt-4 flex h-[80%] w-full gap-4 sm:w-[64%]">
      {/* Dislike Button */}
      <div className="flex h-[96%] w-[48%] justify-start sm:justify-center">
        <button
          onClick={clickDislike}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-red-600 active:scale-95"
          aria-label="delete"
        >
          <X className="h-6 w-6 font-bold md:h-8 md:w-8" />
        </button>
      </div>

      {/* Like Button */}
      <div className="flex h-[96%] w-[48%] justify-end sm:justify-center">
        <button
          onClick={clickLike}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-green-600 active:scale-95"
          aria-label="like"
        >
          <Heart className="h-5 w-5 font-bold md:h-8 md:w-8" />
        </button>
      </div>

      {error && <InputError error={error} />}
    </div>
  );
};

export default ThreeDResponseContainer;
