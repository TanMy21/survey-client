import { useBehavior } from "@/context/BehaviorTrackerContext";
import type { OptionType } from "@/types/optionTypes";
import type { RankListProps } from "@/types/responseTypes";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import RankListItem from "./RankListItem";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitResponse } from "@/hooks/useSurvey";
import { useResponseRegistry } from "@/context/ResponseRegistry";

const RankList = ({ options, question }: RankListProps) => {
  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);
  const [error, setError] = useState<string | null>(null);
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

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    handleFirstInteraction();
    handleClick();
    handleOptionChange();

    const reordered = Array.from(localOptions);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    // Update order locally
    const reorderedWithOrder = reordered.map((option, idx) => ({
      ...option,
      order: idx + 1,
    }));

    setLocalOptions(reorderedWithOrder);

    // await updateOptionOrder({ options: reorderedWithOrder })
    //   .unwrap()
    //   .then()
    //   .catch((err) => console.error("Order update error:", err));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const rankedData = localOptions.map((o, idx) => ({
      optionID: o.optionID,
      value: o.text ?? o.value,
      rank: idx + 1,
    }));

    const rankings = rankedData.map((o) => o.value);

    if (!question?.questionID || !question?.type || !deviceID) {
      setError("Missing identifiers. Please reload and try again.");
      return;
    }

    handleFirstInteraction();
    handleClick();
    markSubmission();

    const behavior = collectBehaviorData();
    console.log("📦 RankScreen behavior data:", behavior);
    console.log("User Ranked Options:", rankedData);

    try {
      await mutateAsync({
        questionID: question.questionID,
        qType: question.type,
        optionID: null,
        response: rankedData,
        deviceID,
        behavior,
      });

      setResponse(question.questionID, true);

      onSubmitAnswer(rankings);
    } catch (e) {
      console.error("[RankList] submit failed:", e);
      setError("Failed to submit ranking. Please try again.");
    }
  };

  return (
    <div className="flex w-full origin-bottom flex-col sm:w-3/5">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2">
        <div className="mx-auto flex w-full flex-col items-center p-1 md:w-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="responses">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex w-full flex-col gap-2 md:w-4/5"
                >
                  {localOptions?.map((option, index) => (
                    <Draggable key={option.optionID} draggableId={option.optionID} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <RankListItem key={option.optionID} response={option} index={index} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-2 flex w-[92%] justify-end pr-6">
            <button
              onClick={handleSubmit}
              className="w-[80px] rounded-[20px] bg-[#005BC4] px-4 py-2 font-semibold text-white transition hover:bg-[#004a9f]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankList;
