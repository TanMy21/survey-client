import type { SwipeNavProps } from "@/types/flowTypes";
import { useEffect, useRef } from "react";

export function useSwipeNav({
  container,
  goNext,
  goPrev,
  canGoPrev,
  canGoNext,
  isEnd,
  cooldownMs = 500,
  swipeThreshold = 48,
  dirBias = 1.4,
  mobileQuery = "(pointer:coarse)",
}: SwipeNavProps) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const lastFiredRef = useRef(0);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    // mobile-only
    const mq = window.matchMedia?.(mobileQuery);
    const isMobile = mq ? mq.matches : true;
    if (!isMobile) return;

    const now = () => performance.now();
    const onCooldown = () => now() - lastFiredRef.current < cooldownMs;
    const fire = (dir: "next" | "prev") => {
      lastFiredRef.current = now();
      if (dir === "next") goNext();
      else goPrev();
    };

    const isInputLike = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      // opt-out
      if (target.closest("[data-ignore-swipe]")) return true;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isInputLike(e.target)) return;
      const t = e.touches[0];
      startX.current = t?.clientX ?? null;
      startY.current = t?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isInputLike(e.target)) return;
      if (onCooldown()) return;

      const sx = startX.current,
        sy = startY.current;
      startX.current = null;
      startY.current = null;
      if (sx == null || sy == null) return;

      const t = e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - sx;
      const dy = t.clientY - sy;

      // mostly horizontal
      if (Math.abs(dx) < dirBias * Math.abs(dy)) return;
      // must be long enough
      if (Math.abs(dx) < swipeThreshold) return;

      if (dx < 0) {
        // swipe left → next
        if (canGoNext && !isEnd) fire("next");
      } else {
        // swipe right → prev
        if (canGoPrev) fire("prev");
      }
    };

    //let horizontal gestures pass — stops browser from hijacking
    const prevTouchAction = el.style.touchAction;
    if (!prevTouchAction) el.style.touchAction = "pan-y"; // allow vertical scroll, handle horizontal

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.style.touchAction = prevTouchAction;
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
    swipeThreshold,
    dirBias,
    mobileQuery,
  ]);
}
