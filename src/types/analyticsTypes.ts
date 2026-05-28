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
  recordSurfaceClick: (e: any) => void;
  recordEmptySpaceClick: (e: any) => void;
}

export interface AnalyticsBridge3DModelProps {
  questionID?: string;
  onReady: (api: AnalyticsBridgeApi) => void;
}

export type SurfaceClickSample = {
  t: number;
  meshName: string | null;
  materialName: string | null;
  faceIndex: number | null;
  screenZoneId: string | null;
  point: {
    x: number;
    y: number;
    z: number;
  };
};
