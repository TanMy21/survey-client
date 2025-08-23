import { useBehavior } from "@/context/BehaviorTrackerContext";
import type { BacktrackLoggerProps } from "@/types/questionTypes";
import { useEffect, useRef } from "react";

export const BacktrackLogger = ({ questionID, visitedRef }: BacktrackLoggerProps) => {
  const { handleBacktrack, collectBehaviorData } = useBehavior();
  const triggeredRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!questionID) return;

    const history = visitedRef.current;
    const prevLastVisited = history.at(-1);

    const hasVisitedBefore = history.slice(0, -1).includes(questionID);
    const hasAlreadyTriggered = triggeredRef.current.has(questionID);

    if (hasVisitedBefore && !hasAlreadyTriggered) {
      triggeredRef.current.add(questionID);
      handleBacktrack();
      const data = collectBehaviorData();
      console.log("📦 Backtracked behavior data:", data);
    }

    if (prevLastVisited !== questionID) {
      history.push(questionID);
    }
  }, [questionID]);

  return null;
};
