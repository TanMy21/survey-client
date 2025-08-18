import type { ThreeDViewProps } from "@/types/response";
import ThreeDResponseContainer from "./ThreeDResponseContainer";

const ThreeDViewer = ({ url, question, setCurrentQuestionIndex }: ThreeDViewProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      {/* 3D Model Section */}
      <div className="flex h-[400px] w-[96%] bg-gray-400 p-1">
        {/* <div className="m-auto flex h-[98%] w-[60%]">
          {ready ? (
            <Interactive3DModelViewer
              key={viewerUrl}
              src={viewerUrl}
              autoRotate
              autoRotateSpeed={0.4}
              height={400}
            />
          ) : (
            <div className="grid h-full w-full place-items-center rounded-xl bg-[#fafafa] text-sm text-[#666]">
              <Model3dLoader />
              Loading your 3D model …
            </div>
          )}
        </div> */}
      </div>

      {/* Action Buttons Section */}
      <div className="flex h-16 w-[96%]">
        <ThreeDResponseContainer
          question={question}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      </div>
    </div>
  );
};

export default ThreeDViewer;
