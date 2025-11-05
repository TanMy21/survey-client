import type { UseAutoSubmitPulseOptions } from "@/types/questionTypes";
import { useEffect, useRef, useState } from "react";

export function useAutoSubmitPulse({
  active,
  delayMs,
  feedbackMs,
  onSubmit,
  getPulseTargets,
  vibrate = true,
  deps = [], // <-- NEW: default empty
}: UseAutoSubmitPulseOptions) {
  const preSubmitFeedbackMs = Math.min(200, Math.max(150, feedbackMs ?? delayMs / 16));
  const autoSubmitTimerRef = useRef<number | null>(null);
  const submitAfterFeedbackTimerRef = useRef<number | null>(null);

  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [etaMs, setEtaMs] = useState<number>(0);

  // -------------------------
  // KEEP LATEST CALLBACKS
  // -------------------------
  const onSubmitRef = useRef(onSubmit); // <-- NEW
  useEffect(() => {
    onSubmitRef.current = onSubmit; // <-- CHANGE: always freshest onSubmit
  }, [onSubmit]);

  const getPulseTargetsRef = useRef(getPulseTargets); // <-- NEW
  useEffect(() => {
    getPulseTargetsRef.current = getPulseTargets; // <-- CHANGE: freshest targets getter
  }, [getPulseTargets]);

  const getTargets = () => getPulseTargetsRef.current(); // <-- helper uses ref

  const reapplyLoopPulse = (targets: Array<HTMLElement | null>) => {
    targets.forEach((el) => el?.classList.remove("ff-pulse-loop"));
    requestAnimationFrame(() => {
      targets.forEach((el) => el?.classList.add("ff-pulse-loop"));
    });
  };

  // Re-apply looping pulse while auto-submitting
  useEffect(() => {
    const targets = getTargets(); // <-- CHANGE: use ref-backed getter
    targets.forEach((el) => el?.classList.remove("ff-pulse-loop"));

    if (!isAutoSubmitting) return;

    reapplyLoopPulse(targets);

    return () => {
      targets.forEach((el) => el?.classList.remove("ff-pulse-loop"));
    };
  }, [isAutoSubmitting]); // <-- CHANGE: removed getPulseTargets from deps

  const triggerPreSubmitFeedback = () => {
    try {
      if (vibrate && "vibrate" in navigator) navigator.vibrate?.(50);
    } catch {}
    const targets = getTargets(); // <-- CHANGE
    targets.forEach((el) => {
      el?.classList.add("ff-pulse-kick");
      window.setTimeout(() => el?.classList.remove("ff-pulse-kick"), 280);
    });
  };

  const clearTimer = () => {
    if (autoSubmitTimerRef.current !== null) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
    if (submitAfterFeedbackTimerRef.current !== null) {
      clearTimeout(submitAfterFeedbackTimerRef.current);
      submitAfterFeedbackTimerRef.current = null;
    }
  };

  const cancel = () => {
    clearTimer();
    setIsAutoSubmitting(false);
    setEtaMs(0);
    const targets = getTargets(); // <-- CHANGE
    targets.forEach((el) => el?.classList.remove("ff-pulse-loop", "ff-pulse-kick"));
  };

  const schedule = () => {
    cancel(); // reset before scheduling
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
      autoSubmitTimerRef.current = window.setTimeout(async () => {
        autoSubmitTimerRef.current = null;
        setIsAutoSubmitting(false);
        await onSubmitRef.current?.(); // <-- CHANGE: call freshest onSubmit
      }, delayMs);
      return;
    }

    autoSubmitTimerRef.current = window.setTimeout(() => {
      autoSubmitTimerRef.current = null;

      triggerPreSubmitFeedback();

      submitAfterFeedbackTimerRef.current = window.setTimeout(async () => {
        submitAfterFeedbackTimerRef.current = null;
        setIsAutoSubmitting(false);
        await onSubmitRef.current?.(); // <-- CHANGE: call freshest onSubmit
      }, preSubmitFeedbackMs);
    }, delayMs - preSubmitFeedbackMs);
  };

  // (Re)schedule when active, delay, feedback window, or deps change.
  useEffect(() => {
    if (active) schedule();
    else cancel();
    return () => cancel();
    // IMPORTANT: include deps so new selections re-arm the timer with fresh closure
  }, [active, delayMs, preSubmitFeedbackMs, ...deps]); // <-- CHANGE

  return { isAutoSubmitting, etaMs, cancel, schedule };
}
