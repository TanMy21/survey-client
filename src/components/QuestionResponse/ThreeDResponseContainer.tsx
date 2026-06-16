import { useBehavior } from "@/context/BehaviorTrackerContext";
import { useQuestionRequired } from "@/hooks/useQuestionRequired";
import type { ThreeDResponseContainerProps } from "@/types/responseTypes";
import { Heart, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { InputError } from "../alert/ResponseErrorAlert";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useResponseRegistry } from "@/context/ResponseRegistry";
import { useHydratedResponse } from "@/hooks/useHydratedResponse";
import { useStoreThreeDBehavior } from "@/api/responseApi";
import { useRegisterQuestionSubmit } from "@/context/QuestionNavigationContext";

const ThreeDResponseContainer = ({ surveyID, question }: ThreeDResponseContainerProps) => {
  const { questionID, type } = question;
  const deviceID = useDeviceId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync } = useSubmitResponse();
  const { mutateAsync: storeThreeDBehavior } = useStoreThreeDBehavior();
  const { onSubmitAnswer } = useFlowRuntime();
  const { markTouched, markAnswered, setRealTimeResponse } = useResponseRegistry();
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

  const {
    handleFirstInteraction,
    handleClick,
    // handleOptionChange,
    markSubmission,
    markAnsweredEvent,
    collectBehaviorData,
  } = useBehavior();

  const submitValue = useCallback(
    async (value: "LIKE" | "DISLIKE") => {
      if (isSubmitting) return;
      if (isRequired && !value) return;
      if (!deviceID || !questionID) return;

      setIsSubmitting(true);

      try {
        if (hydrated) {
          clearHydration();
        }

        markAnswered(questionID);
        markSubmission();
        markAnsweredEvent();

        const data = collectBehaviorData();
        const three = (window as any).__r3f_collect__?.();

        await mutateAsync({
          surveyID,
          deviceID,
          questionID,
          optionID: null,
          qType: type,
          response: value,
          behavior: data,
        });

        setRealTimeResponse(questionID, value, null);
        onSubmitAnswer(value);

        if (three && type === "THREE_D") {
          storeThreeDBehavior({
            surveyID,
            deviceID,
            questionID,
            finalSelectedAnswer: value,
            threeDBehavior: three,
          }).catch((error) => {
            console.error("Failed to store 3D behavior", error);
          });
        }
      } catch (error) {
        setIsSubmitting(false);
        console.error("Failed to submit 3D response", error);
      }
    },
    [
      isSubmitting,
      isRequired,
      deviceID,
      questionID,
      hydrated,
      clearHydration,
      markAnswered,
      markSubmission,
      markAnsweredEvent,
      collectBehaviorData,
      mutateAsync,
      surveyID,
      type,
      setRealTimeResponse,
      onSubmitAnswer,
      storeThreeDBehavior,
    ]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedValue) {
      setError("Your response is required for this question");
      return;
    }

    void submitValue(selectedValue);
  }, [selectedValue, submitValue]);

  useRegisterQuestionSubmit(isRequired || selectedValue != null, handleSubmit);

  const handleSelect = (value: "LIKE" | "DISLIKE") => {
    if (isSubmitting) return;

    handleFirstInteraction();
    handleClick();

    markTouched(questionID);
    setSelectedValue(value);

    void submitValue(value);

    setError(null);
  };

  useEffect(() => {
    if (hydrated && selectedValue) {
      markAnswered(questionID);
    }
  }, [hydrated, selectedValue, questionID, markAnswered]);

  return (
    <div className="m-auto mt-4 flex h-[80%] w-full gap-4 sm:w-[64%]">
      {/* Dislike */}
      <div className="flex h-[96%] w-[48%] justify-start sm:justify-center">
        <button
          disabled={isSubmitting}
          onClick={() => handleSelect("DISLIKE")}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md transition-all duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 ${
            selectedValue === "DISLIKE" ? "scale-110 bg-red-700" : "bg-red-500"
          } hover:scale-105 hover:bg-red-600 active:scale-95`}
        >
          <X className="h-6 w-6 md:h-8 md:w-8" />
        </button>
      </div>

      {/* Like */}
      <div className="flex h-[96%] w-[48%] justify-end sm:justify-center">
        <button
          disabled={isSubmitting}
          onClick={() => handleSelect("LIKE")}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md transition-all duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 ${
            selectedValue === "LIKE" ? "scale-110 bg-green-700" : "bg-green-500"
          } hover:scale-105 hover:bg-green-600 active:scale-95`}
        >
          <Heart className="h-5 w-5 md:h-8 md:w-8" />
        </button>
      </div>

      {error && <InputError error={error} />}
    </div>
  );
};

export default ThreeDResponseContainer;
