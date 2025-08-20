import type { ThreeEvent } from "@react-three/fiber";
import type { OrbitControls } from "three-stdlib";

export interface AnalyticsBridgeApi {
  attachControls: (c: OrbitControls | null) => (() => void) | undefined;
  onMeshOver: (name: string, e?: ThreeEvent<PointerEvent>) => void;
  onMeshOut: (name: string, e?: ThreeEvent<PointerEvent>) => void;
  onMeshClick: (name: string, e?: ThreeEvent<PointerEvent>) => void;
  onFit: () => void;
  onReset: () => void;
  collectR3F: () => any;
}

export interface AnalyticsBridge3DModelProps {
  questionID?: string;
  onReady: (api: AnalyticsBridgeApi) => void;
}
