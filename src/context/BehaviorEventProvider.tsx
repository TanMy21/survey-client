import type { BehaviorEventCtx } from "@/types/responseTypes";
import React, { createContext, useContext, useMemo, useRef } from "react";

const Ctx = createContext<BehaviorEventCtx | null>(null);

/**
 * Provides a stable performance.now() anchor for the whole survey session.
 * This is the reference point used to compute offsetMs for all behavior events.
 */
export const BehaviorEventProvider = ({ children }: { children: React.ReactNode }) => {
  const startRef = useRef(performance.now()); //  created once

  const value = useMemo<BehaviorEventCtx>(() => {
    return {
      sessionStartPerfMs: startRef.current,
      getOffsetMs: () => Math.round(performance.now() - startRef.current),
    };
  }, []);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useBehaviorEvent = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("BehaviorEventProvider missing");
  return ctx;
};
