import type { MediaOptionProps } from "@/types/responseTypes";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const MediaOption = ({ option, isSelected, onSelect }: MediaOptionProps) => {
  const imageSrc = option.image || null;

  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /**
   * Creates one fixed portal container for the hover image preview.
   */
  const portalEl = useMemo(() => {
    if (typeof document === "undefined") return null;

    const el = document.createElement("div");

    el.style.position = "fixed";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";
    el.style.width = "360px";
    el.style.height = "240px";

    return el;
  }, []);

  /**
   * Mounts and removes the hover-preview portal from the document body.
   */
  useEffect(() => {
    if (!portalEl) return;

    document.body.appendChild(portalEl);

    return () => {
      if (document.body.contains(portalEl)) {
        document.body.removeChild(portalEl);
      }
    };
  }, [portalEl]);

  /**
   * Opens the full-size hover preview.
   */
  const handleEnter = () => {
    setVisible(true);
  };

  /**
   * Closes the full-size hover preview.
   */
  const handleLeave = () => {
    setVisible(false);
  };

  /**
   * Positions the hover preview near the cursor while keeping it inside the viewport.
   */
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const padding = 16;
    const previewW = 360;
    const previewH = 240;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = event.clientX + padding;
    let y = event.clientY + padding;

    if (x + previewW > viewportWidth) {
      x = event.clientX - previewW - padding;
    }

    if (y + previewH > viewportHeight) {
      y = event.clientY - previewH - padding;
    }

    setPos({ x, y });
  };

  return (
    <div
      onClick={onSelect}
      className="group flex w-full cursor-pointer flex-col"
    >
      {/* Image area preserves the complete uploaded image. */}
      <div
        className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-[#F9F9F9] transition duration-200 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
          isSelected ? "border-[#005BC4] ring-4 ring-[#D2DEFF]" : "border-[#F1F1F1]"
        }`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={handleMove}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={option.value}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        ) : (
          <div className="text-sm font-medium text-slate-400">No image available</div>
        )}
      </div>

      {/* Full image preview shown on desktop hover. */}
      {imageSrc &&
        visible &&
        portalEl &&
        createPortal(
          <div
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
            }}
            className="fixed z-[9999] h-[240px] w-[360px] rounded-xl bg-white p-2 shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#ffffff]">
              <img
                src={imageSrc}
                alt={option.value}
                referrerPolicy="no-referrer"
                decoding="async"
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
          </div>,
          portalEl
        )}

      <p className="mt-3 px-1 text-[16px] leading-[1.4] font-semibold break-words whitespace-pre-wrap text-black">
        {option.value}
      </p>
    </div>
  );
};

export default MediaOption;
