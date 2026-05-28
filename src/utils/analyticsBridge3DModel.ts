import { use3DModelTracker } from "@/hooks/use3DModelTracker";
import type { AnalyticsBridge3DModelProps, AnalyticsBridgeApi } from "@/types/analyticsTypes";
import { useEffect, useMemo } from "react";

export function AnalyticsBridge3DModel({ questionID, onReady }: AnalyticsBridge3DModelProps) {
  const api = use3DModelTracker(questionID!);

  const adapted: AnalyticsBridgeApi = useMemo(() => {
    return {
      attachControls: (c) => api.attachControls?.(c),

      onMeshOver: (name, _e) => api.onMeshOver?.(name),
      onMeshOut: (name, _e) => api.onMeshOut?.(name),
      onMeshClick: (name, _e) => api.onMeshClick?.(name),

      onFit: api.onFit ?? (() => {}),
      onReset: api.onReset ?? (() => {}),
      collectR3F: api.collectR3F ?? (() => ({})),

      recordSurfaceClick: (e) => api.recordSurfaceClick?.(e),

      recordEmptySpaceClick: (e) => api.recordEmptySpaceClick?.(e),
    };
  }, [api]);

  useEffect(() => {
    onReady(adapted);
  }, [adapted, onReady]);

  return null;
}
