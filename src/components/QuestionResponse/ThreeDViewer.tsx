import { useBehavior } from "@/context/BehaviorTrackerContext";
import type { ThreeDViewProps } from "@/types/responseTypes";
import { useEffect, useState } from "react";
import { Interactive3DModelViewer } from "../screen-components/Interactive3DModelViewer";
import ThreeDResponseContainer from "./ThreeDResponseContainer";

const ThreeDViewer = ({ url, question, setCurrentQuestionIndex }: ThreeDViewProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(url ?? null);
  const { handleInputMethodSwitch } = useBehavior();

  useEffect(() => {
    setViewerUrl(url ?? null);
  }, [url]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") handleInputMethodSwitch();
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown as any);
  }, [handleInputMethodSwitch]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      {/* 3D Model Section */}
      <div className="flex max-h-[800px] w-[75%]">
        <div className="m-auto flex h-[100%] w-[80%]">
          {viewerUrl && (
            <Interactive3DModelViewer
              questionID={question.questionID}
              src={viewerUrl}
              autoRotate
              autoRotateSpeed={0.4}
            />
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex h-24 w-[96%]">
        <ThreeDResponseContainer
          question={question}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      </div>
    </div>
  );
};

export default ThreeDViewer;
