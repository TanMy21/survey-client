import type { MediaOptionProps } from "@/types/responseTypes";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const MediaOption = ({ option, isSelected, onSelect }: MediaOptionProps) => {
  const imageSrc = option.image ? option.image : null;

  // --- preview state ---
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // one portal element per card
  const portalEl = useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";
    el.style.transition = "opacity 120ms ease";
    return el;
  }, []);

  useEffect(() => {
    if (!portalEl) return;
    document.body.appendChild(portalEl);
    return () => {
      try {
        document.body.removeChild(portalEl);
      } catch {}
    };
  }, [portalEl]);

  const handleEnter = () => setVisible(true);
  const handleLeave = () => setVisible(false);
  const handleMove = (e: React.MouseEvent) => {
    const padding = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const previewW = 360;
    const previewH = 240;

    let x = e.clientX + padding;
    let y = e.clientY + padding;
    if (x + previewW > vw) x = e.clientX - previewW - padding;
    if (y + previewH > vh) y = e.clientY - previewH - padding;

    setPos({ x, y });
    if (portalEl) {
      portalEl.style.left = `${x}px`;
      portalEl.style.top = `${y}px`;
      portalEl.style.width = `${previewW}px`;
      portalEl.style.height = `${previewH}px`;
      portalEl.style.opacity = visible ? "1" : "0";
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative flex min-h-[160px] flex-1 cursor-pointer flex-col overflow-hidden rounded-4xl border-2 ${isSelected ? "border-[#005BC4] shadow-[0_0_0_4px_#D2DEFF]" : "border-[#F1F1F1]"} bg-[#F9F9F9] transition-shadow duration-200 hover:border-[#F9F9F9] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:min-h-[200px] xl:min-h-[240px]`}
    >
      {/* ✅ Image Section */}
      <div
        className="relative flex h-[140px] w-full shrink-0 sm:h-[160px] md:h-[180px] xl:h-[200px]"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={handleMove}
      >
        <div className="flex flex-grow items-center justify-center overflow-hidden rounded">
          <img src={imageSrc!} alt={option.value} className="h-full w-full object-cover" />
        </div>

        {/* Floating preview via portal */}
        {imageSrc &&
          visible &&
          portalEl &&
          createPortal(
            <div className="rounded-xl bg-white/60 p-2 shadow-[0_8px_28px_rgba(0,0,0,0.25)] backdrop-blur">
              <img
                src={imageSrc}
                alt={option.value}
                className="h-full w-full rounded-md object-contain"
                draggable={false}
              />
            </div>,
            portalEl
          )}
      </div>

      {/* ✅ Text + Index Section */}
      <div className="relative flex min-h-[40px] w-full flex-grow items-start gap-1 bg-white p-1 xl:min-h-[60px]">
        <div
          className={`flex min-h-[80%] w-[16%] justify-center ${
            option.value.length > 24 ? "items-center" : "items-start"
          } ${option.value.length <= 30 ? "pt-[4px]" : ""}`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#5B6AD0] text-[12px] font-bold text-white">
            {option.text}
          </div>
        </div>

        <div className="flex min-h-[40px] flex-1 items-start justify-start px-2 pr-4 break-words">
          <p className="p-1 text-[16px] leading-[1.4] font-medium break-words whitespace-pre-wrap text-black">
            {option.value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaOption;
