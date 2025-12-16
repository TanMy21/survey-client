import { useSession } from "@/context/useSessionContext";
import { useEffect, useRef } from "react";
import { useMarkActive, usePauseSession } from "./useSession";
import { LS_DID_KEY } from "@/utils/deviceID";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { END_SCREEN_TYPE, NON_FLOW_TYPES } from "@/types/flowTypes";

export function useSessionActivitySync(surveyID: string) {
  const { session } = useSession();
  const { currentQuestion } = useFlowRuntime();
  const deviceID = localStorage.getItem(LS_DID_KEY);

  const { mutateAsync: pause } = usePauseSession();
  const { mutateAsync: markActive } = useMarkActive();

  // Global visibility flag across tabs
  const anyTabVisibleRef = useRef(false);

  // Tracks whether THIS tab is currently on a question screen
  const isQuestionRef = useRef(false);

  // To detect transitions non-question to question
  const prevIsQuestionRef = useRef(false);

  // BroadcastChannel handle for cross-tab coordination
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Timeout ID for debounced global pause evaluation
  const pauseCheckTimeoutRef = useRef<number | null>(null);

  /**
   * Track when we are on a QUESTION vs NON-QUESTION screen.
   * - Updates isQuestionRef on each question type change.
   * - When entering a QUESTION (from non-question) while visible,
   *   treat that as survey started / resumed and mark ACTIVE once.
   */
  useEffect(() => {
    if (!session) return;
    if (session.sessionState === "COMPLETED") return;

    // if (!isQuestionRef.current) return;

    const qType = currentQuestion?.type;
    const isNonQuestion = !qType || NON_FLOW_TYPES.has(qType) || qType === END_SCREEN_TYPE;

    const nowIsQuestion = !isNonQuestion;
    const wasQuestion = prevIsQuestionRef.current;

    // Update refs with latest state
    isQuestionRef.current = nowIsQuestion;
    prevIsQuestionRef.current = nowIsQuestion;

    // fire ACTIVE when transitioning non-question to question while the tab is visible
    if (!wasQuestion && nowIsQuestion && document.visibilityState === "visible") {
      anyTabVisibleRef.current = true;
      void markActive({ surveyID, deviceID: deviceID! });
    }
  }, [session, surveyID, currentQuestion?.type, deviceID, markActive]);

  /**
   * Set up visibility + BroadcastChannel once per session+survey.
   * - This effect does NOT depend on currentQuestion to avoid re-init spam.
   * - Uses isQuestionRef.current at runtime to decide whether to call
   *   markActive/pause (so non-question screens are ignored automatically).
   */
  useEffect(() => {
    if (!session) return;
    if (!deviceID) return;
    if (session.sessionState === "COMPLETED") return;

    // if (!isQuestionRef.current) return;

    // Create broadcast channel for this survey + device.
    const channel = new BroadcastChannel(`survey-activity-${surveyID}-${deviceID}`);
    channelRef.current = channel;

    // Broadcast helper for other tabs.
    const broadcast = (msg: "VISIBLE" | "HIDDEN") => {
      channel.postMessage({ type: msg });
    };

    // Debounced evaluator for pausing session when ALL tabs hidden.
    const evaluateGlobalPause = () => {
      if (pauseCheckTimeoutRef.current != null) {
        window.clearTimeout(pauseCheckTimeoutRef.current);
      }

      pauseCheckTimeoutRef.current = window.setTimeout(() => {
        // Only pause if:
        // 1) No tab of this survey is visible
        // 2) And this tab is (or was) on a question screen.
        if (!anyTabVisibleRef.current && isQuestionRef.current) {
          void pause({ surveyID, deviceID: deviceID! });
        }
      }, 200);
    };

    // Handle messages from other tabs of the same survey.
    const handleChannelMessage = (ev: MessageEvent) => {
      const { type } = ev.data || {};

      if (type === "VISIBLE") {
        anyTabVisibleRef.current = true;

        // Only mark ACTIVE if this tab is currently on a question.
        if (isQuestionRef.current) {
          void markActive({ surveyID, deviceID: deviceID! });
        }
      } else if (type === "HIDDEN") {
        if (document.visibilityState === "visible" && isQuestionRef.current) {
          anyTabVisibleRef.current = true;
          void markActive({ surveyID, deviceID: deviceID! });
          broadcast("VISIBLE"); // announce as visible again
          return;
        }

        evaluateGlobalPause();
      }
    };

    channel.onmessage = handleChannelMessage;

    // Handle tab's visibility changes.
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";

      if (isVisible) {
        anyTabVisibleRef.current = true;
        broadcast("VISIBLE");

        // Only mark ACTIVE when we are actually on a question.
        if (isQuestionRef.current) {
          void markActive({ surveyID, deviceID: deviceID! });
        }
      } else {
        anyTabVisibleRef.current = false;
        broadcast("HIDDEN");
        evaluateGlobalPause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial visibility on mount
    if (document.visibilityState === "visible") {
      anyTabVisibleRef.current = true;
      broadcast("VISIBLE");

      if (isQuestionRef.current) {
        void markActive({ surveyID, deviceID: deviceID! });
      }
    }

    // On tab close
    const handleUnload = () => {
      try {
        navigator.sendBeacon(
          `${import.meta.env.VITE_BASE_URL}/ses/pause`,
          JSON.stringify({ surveyID, deviceID })
        );
      } catch {
        // ignore sendBeacon errors
      }
      broadcast("HIDDEN");
    };

    window.addEventListener("unload", handleUnload);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("unload", handleUnload);
      channel.close();
      channelRef.current = null;

      if (pauseCheckTimeoutRef.current != null) {
        window.clearTimeout(pauseCheckTimeoutRef.current);
        pauseCheckTimeoutRef.current = null;
      }
    };
  }, [session, surveyID, deviceID, pause, markActive]);
}
