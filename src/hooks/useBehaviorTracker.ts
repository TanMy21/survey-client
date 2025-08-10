import { useEffect, useRef, useState } from "react";

export const useBehaviorTracker = (
  questionID: string,
  questionType: string,
  backtrackCountMapRef: React.RefObject<Map<string, number>>
) => {
  // Pointer and device type
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Timing
  const startTimeRef = useRef(new Date());
  const firstInteractionRef = useRef<Date | null>(null);
  const [submissionDelay, setSubmissionDelay] = useState<number | null>(null);

  // Counts and flags
  const clickCountRef = useRef(0);
  const optionChangeCountRef = useRef(0);
  const [inputMethodSwitch, setInputMethodSwitch] = useState(false);

  // Focus & blur
  const blurStart = useRef<number | null>(null);
  const [blurCount, setBlurCount] = useState(0);
  const [focusCount, setFocusCount] = useState(1);
  const [isFocused, setIsFocused] = useState(true);
  const blurDurationsRef = useRef<number[]>([]);

  // Tracking
  const scrollEventsRef = useRef<{ scrollY: number; scrollPct: number; timestamp: number }[]>([]);
  const hoverDurationsRef = useRef<Record<string, number> | null>(null);
  const dwellPointsRef = useRef<{ x: number; y: number; duration: number }[] | null>(null);
  const movementPathRef = useRef<{ x: number; y: number; timestamp: number }[] | null>(null);
  const movementTracksRef = useRef<
    { x: number; y: number; isClick: boolean; pressure: number | null }[] | null
  >(null);
  const idleTimeoutsRef = useRef<{ start: number; end: number; duration: number }[]>([]);

  // Typing
  const typingStatsRef = useRef({
    totalChars: 0,
    backspaces: 0,
    paste: false,
    keyTimestamps: [] as number[],
  });

  // Handlers
  const handleFirstInteraction = () => {
    firstInteractionRef.current ??= new Date();
  };

  const handleClick = () => {
    clickCountRef.current += 1;
  };

  const handleOptionChange = () => {
    optionChangeCountRef.current += 1;
    firstInteractionRef.current ??= new Date();
  };

  const handleTyping = (key: string) => {
    const now = Date.now();
    typingStatsRef.current.keyTimestamps.push(now);
    firstInteractionRef.current ??= new Date();
    if (key === "Backspace") typingStatsRef.current.backspaces += 1;
    if (key.length === 1) typingStatsRef.current.totalChars += 1;
  };

  const handlePaste = () => {
    typingStatsRef.current.paste = true;
  };

  const handleBacktrack = () => {
    const current = backtrackCountMapRef.current.get(questionID) || 0;
    backtrackCountMapRef.current.set(questionID, current + 1);
  };

  const handleInputMethodSwitch = () => {
    setInputMethodSwitch(true);
  };

  const markSubmission = () => {
    if (firstInteractionRef.current) {
      setSubmissionDelay(Date.now() - firstInteractionRef.current.getTime());
    }
  };

  // ---- Idle detection (30s) ----
  const IDLE_MS = 30_000;
  const idleStartRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const startIdleTimer = () => {
    stopIdleTimer();
    idleTimerRef.current = window.setTimeout(() => {
      idleStartRef.current = Date.now();
    }, IDLE_MS);
  };

  const stopIdleTimer = () => {
    if (idleTimerRef.current != null) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const bumpActivity = () => {
    if (idleStartRef.current != null) {
      const end = Date.now();
      const start = idleStartRef.current;
      idleTimeoutsRef.current.push({ start, end, duration: end - start });
      idleStartRef.current = null;
    }
    startIdleTimer();
  };

  useEffect(() => {
    startIdleTimer();
    return () => stopIdleTimer();
  }, []);

  useEffect(() => {
    const detectPointerType = (e: PointerEvent) => {
      if (e.pointerType === "touch") setIsTouchDevice(true);
    };

    if (!isTouchDevice) {
      hoverDurationsRef.current = {};
      dwellPointsRef.current = [];
      movementPathRef.current = [];
      movementTracksRef.current = [];
    } else {
      movementPathRef.current = [];
      movementTracksRef.current = [];
    }

    // --- Throttled scroll tracking ---
    let lastScrollTs = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - lastScrollTs < 150) return; // ~6.6 Hz
      lastScrollTs = now;

      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - doc.clientHeight);
      const y = window.scrollY || window.pageYOffset || 0;
      const pct = maxScroll > 0 ? +(y / maxScroll).toFixed(3) : 0;

      scrollEventsRef.current.push({ scrollY: y, scrollPct: pct, timestamp: Date.now() });
      bumpActivity();
    };

    // --- Throttled mouse/touch move sampling (~5 Hz) ---
    let lastMoveTs = 0;
    const sampleMove = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastMoveTs < 200) return; // 5 Hz
      lastMoveTs = now;
      movementPathRef.current?.push({ x, y, timestamp: Date.now() });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      sampleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouchDevice) return;
      const t = e.touches[0];
      if (!t) return;
      sampleMove(t.clientX, t.clientY);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (isTouchDevice) return;
      movementTracksRef.current?.push({
        x: e.clientX,
        y: e.clientY,
        isClick: true,
        pressure: null,
      });
      bumpActivity();
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const force = typeof t.force === "number" ? t.force : null;
      movementTracksRef.current?.push({
        x: t.clientX,
        y: t.clientY,
        isClick: true,
        pressure: force,
      });
      handleFirstInteraction();
      bumpActivity();
    };

    const onFocus = () => {
      setIsFocused(true);
      setFocusCount((c) => c + 1);
      if (blurStart.current) {
        blurDurationsRef.current.push(Date.now() - blurStart.current);
        blurStart.current = null;
      }
    };

    const onBlur = () => {
      setIsFocused(false);
      setBlurCount((c) => c + 1);
      blurStart.current = Date.now();
    };

    const onVisibility = () => {
      if (document.hidden) {
        onBlur();
      } else {
        onFocus();
      }
    };

    window.addEventListener("pointerdown", detectPointerType, { once: true });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility as any);
    };
  }, [isTouchDevice]);

  const collectBehaviorData = () => {
    const nowWall = Date.now();
    const now = new Date(nowWall);
    const first = firstInteractionRef.current ?? now;
    const keyDelays = typingStatsRef.current.keyTimestamps;
    const avgKeyDelay =
      keyDelays.length >= 2
        ? Math.round(
            keyDelays
              .slice(1)
              .map((t, i) => t - keyDelays[i])
              .reduce((a, b) => a + b, 0) /
              (keyDelays.length - 1)
          )
        : 0;

    const backtrackCount = backtrackCountMapRef?.current?.get(questionID) ?? 0;

    if (idleStartRef.current != null) {
      const end = nowWall;
      const start = idleStartRef.current;
      idleTimeoutsRef.current.push({ start, end, duration: end - start });
      idleStartRef.current = null;
    }

    const scrollDepth = scrollEventsRef.current.length
      ? Math.max(...scrollEventsRef.current.map((e) => e.scrollY))
      : 0;

    return {
      questionID,
      questionType,
      startTime: startTimeRef.current.toISOString(),
      firstInteractionTime: first.toISOString(),
      answerTime: now.toISOString(),
      interactionDuration: now.getTime() - startTimeRef.current.getTime(),
      hesitationTime: first.getTime() - startTimeRef.current.getTime(),
      clickCount: clickCountRef.current,
      optionChangeCount: optionChangeCountRef.current,
      backtrackCount,
      scrollEvents: scrollEventsRef.current,
      scrollDepth: scrollDepth,
      hoverDurations: hoverDurationsRef.current,
      movementPath: movementPathRef.current,
      dwellPoints: dwellPointsRef.current,
      isFocused,
      blurCount,
      focusCount,
      blurDurations: blurDurationsRef.current,
      inputMethodSwitch,
      idleTimeouts: idleTimeoutsRef.current,
      submissionDelay,
      typingStats: {
        totalChars: typingStatsRef.current.totalChars,
        backspaces: typingStatsRef.current.backspaces,
        paste: typingStatsRef.current.paste,
        avgKeyDelay,
      },
      movementTracks: movementTracksRef.current,
    };
  };

  return {
    handleFirstInteraction,
    handleClick,
    handleOptionChange,
    handleTyping,
    handlePaste,
    handleBacktrack,
    handleInputMethodSwitch,
    markSubmission,
    collectBehaviorData,
  };
};
