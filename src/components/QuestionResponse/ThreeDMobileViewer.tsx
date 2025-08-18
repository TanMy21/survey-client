import type { ThreeDViewProps } from "@/types/response";
import { Heart, X } from "lucide-react";

const ThreeDMobileViewer = ({ url }: ThreeDViewProps) => {
  return (
    <div className="mx-auto flex h-full w-[98%] flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex h-[60px] w-[98%]">
        {/* Delete Button */}
        <div className="flex h-[98%] w-[98%] items-center justify-center">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-red-600 active:scale-95"
            aria-label="delete"
          >
            <X className="h-6 w-6 font-bold" />
          </button>
        </div>

        {/* Like Button */}
        <div className="flex h-[98%] w-[98%] items-center justify-center">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-green-600 active:scale-95"
            aria-label="like"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
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
