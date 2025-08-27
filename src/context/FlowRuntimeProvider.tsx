import { useFlowController } from "@/hooks/useFlowController";
import type { SurveyPayload, UseFlowControllerApi } from "@/types/flowTypes";
import React, { createContext, useContext } from "react";

// Context strictly for flow runtime (separate from your existing canProceed context).
const FlowRuntimeContext = createContext<UseFlowControllerApi | null>(null);

export const useFlowRuntime = (): UseFlowControllerApi => {
  const ctx = useContext(FlowRuntimeContext);
  if (!ctx) throw new Error("useFlowRuntime must be used within <FlowRuntimeProvider />");
  return ctx;
};

export const FlowRuntimeProvider: React.FC<{
  payload: SurveyPayload;
  children: React.ReactNode;
}> = ({ payload, children }) => {
  const api = useFlowController(payload);
  return <FlowRuntimeContext.Provider value={api}>{children}</FlowRuntimeContext.Provider>;
};
