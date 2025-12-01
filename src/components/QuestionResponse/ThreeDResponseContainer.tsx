import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { ThreeDResponseContainerProps } from "@/types/responseTypes";
import { Heart, X } from "lucide-react";
import { useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";

const ThreeDResponseContainer = ({ surveyID, question }: ThreeDResponseContainerProps) => {
  const { questionID, type } = question;
  const deviceID = useDeviceId();
  const { mutateAsync } = useSubmitResponse();
  const { onSubmitAnswer } = useFlowRuntime();
  const { setResponse } = useResponseRegistry();
  const isRequired = useQuestionRequired(question);

  const {
    value: selectedValue,
    setValue: setSelectedValue,
    hydrated,
    clearHydration,
  } = useHydratedResponse<"LIKE" | "DISLIKE" | null>({
    question,
    defaultValue: null,
    mapPersisted: (p) => (p.value === "LIKE" || p.value === "DISLIKE" ? p.value : null),
  });

  const [error, setError] = useState<string | null>(null);

  const {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    markSubmission,
    collectBehaviorData,
  } = useBehavior();

 
  const submitValue = async (value: "LIKE" | "DISLIKE") => {
    if (isRequired && !value) return;
    if (!deviceID || !questionID) return;

       if (hydrated) {
      clearHydration();
      return;
    }

    markSubmission();

    const data = collectBehaviorData();
    const three = (window as any).__r3f_collect__?.();

    console.log("📦 Three D Model interaction:", three);
    console.log("📦 Three D behavior data:", data);
    console.log("📦 Selected response:", value);

    await mutateAsync({
      surveyID,
      deviceID,
      questionID,
      optionID: null,
      qType: type,
      response: value,
      behavior: data,
    });

    setResponse(questionID, true);
    onSubmitAnswer(value);
  };


  const handleSelect = (value: "LIKE" | "DISLIKE") => {
    handleFirstInteraction();
    handleClick();

    if (selectedValue !== value) {
      handleOptionChange();
    }
    setSelectedValue(value);

    if (!hydrated) void submitValue(value);

    setError(null);
  };


  return (
    <div className="m-auto mt-4 flex h-[80%] w-full gap-4 sm:w-[64%]">
      {/* Dislike */}
      <div className="flex h-[96%] w-[48%] justify-start sm:justify-center">
        <button
          onClick={() => handleSelect("DISLIKE")}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md transition-all duration-150 ease-in-out
            ${
              selectedValue === "DISLIKE"
                ? "scale-110 bg-red-700"
                : "bg-red-500"
            }
            hover:scale-105 hover:bg-red-600 active:scale-95`}
        >
          <X className="h-6 w-6 md:h-8 md:w-8" />
        </button>
      </div>

      {/* Like */}
      <div className="flex h-[96%] w-[48%] justify-end sm:justify-center">
        <button
          onClick={() => handleSelect("LIKE")}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md transition-all duration-150 ease-in-out
            ${
              selectedValue === "LIKE"
                ? "scale-110 bg-green-700"
                : "bg-green-500"
            }
            hover:scale-105 hover:bg-green-600 active:scale-95`}
        >
          <Heart className="h-5 w-5 md:h-8 md:w-8" />
        </button>
      </div>

      {error && <InputError error={error} />}
    </div>
  );
};


export default ThreeDResponseContainer;
