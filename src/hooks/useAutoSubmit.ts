import type { UseAutoSubmitPulseOptions } from "@/types/questionTypes";
import { useEffect, useRef, useState } from "react";

export function useAutoSubmitPulse({
  active,
  delayMs,
  feedbackMs,
  onSubmit,
  getPulseTargets,
  vibrate = true,
}: UseAutoSubmitPulseOptions) {
  const preSubmitFeedbackMs = Math.min(200, Math.max(150, feedbackMs ?? delayMs / 16));
  const autoSubmitTimerRef = useRef<number | null>(null);
  const submitAfterFeedbackTimerRef = useRef<number | null>(null);

  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [etaMs, setEtaMs] = useState<number>(0);

  const reapplyLoopPulse = (targets: Array<HTMLElement | null>) => {
    targets.forEach((el) => el?.classList.remove("ff-pulse-loop"));

    requestAnimationFrame(() => {
      targets.forEach((el) => el?.classList.add("ff-pulse-loop"));
    });
  };

  useEffect(() => {
    const targets = getPulseTargets();

    targets.forEach((el) => el?.classList.remove("ff-pulse-loop"));

    if (!isAutoSubmitting) return;

    reapplyLoopPulse(targets);

    return () => {
      targets.forEach((el) => el?.classList.remove("ff-pulse-loop"));
    };
  }, [isAutoSubmitting, getPulseTargets]);

  const triggerPreSubmitFeedback = () => {
    try {
      if (vibrate && "vibrate" in navigator) navigator.vibrate?.(50);
    } catch {}
    const targets = getPulseTargets();
    targets.forEach((el) => {
      el?.classList.add("ff-pulse-kick");
      window.setTimeout(() => el?.classList.remove("ff-pulse-kick"), 280);
    });
  };

  const cancel = () => {
    if (autoSubmitTimerRef.current !== null) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
    if (submitAfterFeedbackTimerRef.current !== null) {
      clearTimeout(submitAfterFeedbackTimerRef.current);
      submitAfterFeedbackTimerRef.current = null;
    }
    setIsAutoSubmitting(false);
    setEtaMs(0);

    const targets = getPulseTargets();
    targets.forEach((el) => el?.classList.remove("ff-pulse-loop", "ff-pulse-kick"));
  };

  const schedule = () => {
    cancel();
    setIsAutoSubmitting(true);
    setEtaMs(delayMs);

    const startedAt = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(delayMs - elapsed, 0);
      setEtaMs(remaining);
      if (
        remaining > 0 &&
        (autoSubmitTimerRef.current !== null || submitAfterFeedbackTimerRef.current !== null)
      ) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    if (delayMs <= preSubmitFeedbackMs + 40) {
      autoSubmitTimerRef.current = window.setTimeout(() => {
        autoSubmitTimerRef.current = null;
        setIsAutoSubmitting(false);
        onSubmit();
      }, delayMs);
      return;
    }

    autoSubmitTimerRef.current = window.setTimeout(() => {
      autoSubmitTimerRef.current = null;

      triggerPreSubmitFeedback();

      submitAfterFeedbackTimerRef.current = window.setTimeout(() => {
        submitAfterFeedbackTimerRef.current = null;
        setIsAutoSubmitting(false);
        onSubmit();
      }, preSubmitFeedbackMs);
    }, delayMs - preSubmitFeedbackMs);
  };

  useEffect(() => {
    if (active) schedule();
    else cancel();
    return () => cancel();
  }, [active]);

  return { isAutoSubmitting, etaMs, cancel, schedule };
}
