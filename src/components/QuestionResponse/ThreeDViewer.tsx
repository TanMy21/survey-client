import type { ThreeDViewProps } from "@/types/response";
import { Heart, X } from "lucide-react";

const ThreeDViewer = ({ url }: ThreeDViewProps) => {
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
        <div className="m-auto flex h-[80%] w-[32%] gap-4">
          {/* Delete Button */}
          <div className="flex h-[96%] w-[48%] justify-center">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-red-600 active:scale-95"
              aria-label="delete"
            >
              <X className="h-6 w-6 font-bold" />
            </button>
          </div>

          {/* Like Button */}
          <div className="flex h-[96%] w-[48%] justify-center">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:bg-green-600 active:scale-95"
              aria-label="like"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDViewer;
