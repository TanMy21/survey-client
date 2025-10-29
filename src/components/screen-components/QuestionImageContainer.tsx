import type { QuestionImageContainerProps } from "@/types/questionTypes";

const QuestionImageContainer = ({
  questionImageWidth,
  questionImageHeight,
  questionImageUrl,
  questionImageAltText,
}: QuestionImageContainerProps) => {
  return (
    <div className="mx-auto mb-5 flex h-[340px] w-full flex-row items-center justify-center">
      <div
        className="relative flex flex-row items-center justify-center rounded-lg border-2 border-dashed border-blue-500 bg-[#F8F9FE]"
        style={{ width: questionImageWidth, height: questionImageHeight }}
      >
        <div className="z-[1] flex h-full w-full flex-row items-center justify-center overflow-hidden rounded-lg">
          {questionImageUrl && (
            <img
              src={questionImageUrl}
              alt={questionImageAltText}
              className="block h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionImageContainer;
