import type { OptionType } from "@/types/option";
import type { RankListProps } from "@/types/response";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import RankListItem from "./RankListItem";

const RankList = ({ options }: RankListProps) => {
  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

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

  return (
    <div className="flex w-3/5 origin-bottom flex-col border-2 border-gray-300">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 px-0 md:w-4/5 md:px-2 border-2 border-red-500">
        <div className="mx-auto flex w-[92%] flex-col items-center p-1 md:w-full border-2 border-blue-500">
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
        </div>
      </div>
    </div>
  );
};

export default RankList;
