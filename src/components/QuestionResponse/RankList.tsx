import { useBehavior } from "@/context/BehaviorTrackerContext";
import type { OptionType } from "@/types/optionTypes";
import type { RankListProps } from "@/types/responseTypes";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import RankListItem from "./RankListItem";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";

const RankList = ({ options }: RankListProps) => {
  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);
  const { onSubmitAnswer } = useFlowRuntime();
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
  };

  const handleSubmit = () => {
    const rankedData = localOptions.map(({ optionID, text, order }) => ({
      optionID,
      value: text,
      order,
    }));

    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 RankScreen behavior data:", data);
    console.log("User Ranked Options:", rankedData);
    const rankings = rankedData.map((o) => o.value);
    onSubmitAnswer(rankings);
  };

  return (
    <div className="flex w-3/5 origin-bottom flex-col">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2">
        <div className="mx-auto flex w-[92%] flex-col items-center p-1 md:w-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="responses">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex w-[92%] flex-col gap-2 md:w-4/5"
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
