import type { ThreeDViewProps } from "@/types/responseTypes";
import { useEffect, useState } from "react";
import { Interactive3DModelViewer } from "../screen-components/Interactive3DModelViewer";
import ThreeDResponseContainer from "./ThreeDResponseContainer";

const ThreeDMobileViewer = ({ url, question, setCurrentQuestionIndex }: ThreeDViewProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(url ?? null);
  const ready = !!viewerUrl;

  useEffect(() => {
    setViewerUrl(url ?? null);
  }, [url]);

  return (
    <div className="tabp-l:w-full mx-auto flex h-full w-[98%] flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex h-[80px] w-[98%]">
        <ThreeDResponseContainer
          question={question}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      </div>

      {/* 3D Viewer */}
      <div className="flex h-[40vh] w-full">
        {/* {ready ? ( */}
        <Interactive3DModelViewer
          key={viewerUrl}
          src={viewerUrl!}
          autoRotate
          autoRotateSpeed={0.4}
        />
        {/* ) : (
          <div className="grid h-full w-full place-items-center rounded-xl bg-[#fafafa] text-sm text-[#666]">
            Loading your 3D model …
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ThreeDMobileViewer;
