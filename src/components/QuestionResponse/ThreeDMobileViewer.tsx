import type { ThreeDViewProps } from "@/types/response";
import ThreeDResponseContainer from "./ThreeDResponseContainer";

const ThreeDMobileViewer = ({ url, question, setCurrentQuestionIndex }: ThreeDViewProps) => {
  return (
    <div className="mx-auto flex h-full w-[98%] flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex h-[60px] w-[98%]">
        <ThreeDResponseContainer question={question} setCurrentQuestionIndex={setCurrentQuestionIndex}/>
      </div>

      {/* 3D Viewer */}
      <div className="flex h-[400px] w-[98%] bg-gray-400 p-1">
        {/* <Interactive3DModelViewer
          src={url}
          autoRotate
          autoRotateSpeed={0.4}
          height={showQuestion ? 360 : 500}
        /> */}
      </div>
    </div>
  );
};

export default ThreeDMobileViewer;
