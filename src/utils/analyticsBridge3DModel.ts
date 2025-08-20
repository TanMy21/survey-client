import { use3DModelTracker } from "@/hooks/use3DModelTracker";
import type { AnalyticsBridge3DModelProps, AnalyticsBridgeApi } from "@/types/analytics";
import { useEffect, useMemo } from "react";

export function AnalyticsBridge3DModel({ questionID, onReady }: AnalyticsBridge3DModelProps) {
  const api = use3DModelTracker(questionID!);
  // ^ assumed to expose: { attachControls(c), onMeshOver(name, e), onMeshOut(name, e), onMeshClick(name, e), onFit(), onReset?(), collectR3F?() }

  const adapted: AnalyticsBridgeApi = useMemo(() => {
    return {
      attachControls: (c) => api.attachControls?.(c),

      // Accept (name, e) as your onReady type requires, but ignore `e` when calling the tracker.
      onMeshOver: (name, _e) => api.onMeshOver?.(name),
      onMeshOut: (name, _e) => api.onMeshOut?.(name),
      onMeshClick: (name, _e) => api.onMeshClick?.(name),

      onFit: api.onFit ?? (() => {}),
      onReset: api.onReset ?? (() => {}),
      collectR3F: api.collectR3F ?? (() => ({})),
    };
  }, [api]);

  useEffect(() => {
    onReady(adapted);
  }, [adapted, onReady]);

  return null;
}
