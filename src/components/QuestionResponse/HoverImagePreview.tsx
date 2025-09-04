import type { HoverImagePreviewProps } from "@/types/responseTypes";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HoverImagePreview = ({ src, alt }: HoverImagePreviewProps) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const [portalEl] = useState(() => {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none"; // do not block clicks on the card
    return el;
  });

  useEffect(() => {
    document.body.appendChild(portalEl);
    return () => {
      try {
        document.body.removeChild(portalEl);
      } catch {}
    };
  }, [portalEl]);

  // position and visibility handlers for the anchor
  const onMouseEnter = () => setVisible(true);
  const onMouseLeave = () => setVisible(false);
  const onMouseMove = (e: React.MouseEvent) => {
    // preview offset
    const padding = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const previewW = 360;
    const previewH = 240;

    // keep inside viewport
    let x = e.clientX + padding;
    let y = e.clientY + padding;
    if (x + previewW > vw) x = e.clientX - previewW - padding;
    if (y + previewH > vh) y = e.clientY - previewH - padding;

    setPos({ x, y });
  };

  // inline styles for performance
  if (portalEl) {
    portalEl.style.left = `${pos.x}px`;
    portalEl.style.top = `${pos.y}px`;
    portalEl.style.width = `360px`;
    portalEl.style.height = `240px`;
    portalEl.style.opacity = visible ? "1" : "0";
    portalEl.style.transition = "opacity 120ms ease";
  }

  return (
    <>
      <div
        ref={anchorRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        className="contents"
      />
      {visible &&
        createPortal(
          <div className="rounded-xl bg-white/60 p-2 shadow-[0_8px_28px_rgba(0,0,0,0.25)] backdrop-blur">
            <img
              src={src}
              alt={alt}
              className="h-full w-full rounded-md object-contain"
              draggable={false}
            />
          </div>,
          portalEl
        )}
    </>
  );
};

export default HoverImagePreview;
