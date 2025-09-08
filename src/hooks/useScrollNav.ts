import type { ScrollNavProps } from "@/types/flowTypes";
import { useEffect, useRef } from "react";

export function useScrollNav({
  container,
  goNext,
  goPrev,
  canGoPrev,
  canGoNext,
  isEnd,
  cooldownMs = 600,
  wheelThreshold = 100,
  touchThreshold = 48,
}: ScrollNavProps) {
  const accumRef = useRef(0);
  const lastFiredRef = useRef(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const now = () => performance.now();
    const onCooldown = () => now() - lastFiredRef.current < cooldownMs;
    const fire = (dir: "next" | "prev") => {
      lastFiredRef.current = now();
      if (dir === "next") goNext();
      else goPrev();
    };

    const isInputLike = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (target.isContentEditable) return true;
      return !!target.closest('[data-ignore-scrollnav="true"],[data-ignore-scrollnav]');
    };

    const onWheel = (e: WheelEvent) => {
      if (isInputLike(e.target)) return;
      if (onCooldown()) return;

      const atTop = el.scrollTop <= 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      accumRef.current += e.deltaY;

      if (accumRef.current > wheelThreshold) {
        if (canGoNext && !isEnd && atBottom) {
          fire("next");
        }
        accumRef.current = 0;
        return;
      }

      if (accumRef.current < -wheelThreshold) {
        if (canGoPrev && atTop) {
          fire("prev");
        }
        accumRef.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isInputLike(e.target)) return;
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isInputLike(e.target)) return;
      if (onCooldown()) return;
      const startY = touchStartY.current;
      touchStartY.current = null;
      if (startY == null) return;

      const endY = e.changedTouches[0]?.clientY ?? startY;
      const dy = endY - startY;

      const atTop = el.scrollTop <= 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      if (dy < -touchThreshold) {
        if (canGoNext && !isEnd && atBottom) fire("next");
        return;
      }

      if (dy > touchThreshold) {
        if (canGoPrev && atTop) fire("prev");
      }
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    container,
    goNext,
    goPrev,
    canGoPrev,
    canGoNext,
    isEnd,
    cooldownMs,
    wheelThreshold,
    touchThreshold,
  ]);
}
