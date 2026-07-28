import type { MutableRefObject } from "react";
import type * as THREE from "three";
import type { AnalyticsBridgeApi } from "./analyticsTypes";
import type { ViewName } from "./questionTypes";

export interface SceneProps {
  isMobile: boolean;
  validSrc: string;
  questionID: string;
  hdrEnvUrl?: string;
  background: string;
  exposure: number;
  ambientIntensity: number;
  hemiIntensity: number;
  envResolution: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  minDistance: number;
  maxDistance: number;
  maxPolarAngle: number;
  initialView: ViewName;
  frontIsNegZ: boolean;
  onCollectReady?: (collector: (() => unknown) | undefined) => void;
  onAttachControls?: (c: any) => void;
  onMeshOver?: (name: string, e: any) => void;
  onMeshOut?: (name: string, e: any) => void;
  onMeshClick?: (name: string, e: any) => void;
  onFit?: () => void;
  controlsRef: MutableRefObject<any>;
  analyticsRef: MutableRefObject<AnalyticsBridgeApi | null>;
  setModelRoot: (o: THREE.Object3D | null) => void;
  modelRoot: THREE.Object3D | null;
}
