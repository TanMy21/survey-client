import { useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import type { AnalyticsBridgeApi } from "@/types/analyticsTypes";
import type { Interactive3DModelViewerProps } from "@/types/questionTypes";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Scene from "./Scene";

export const Interactive3DModelViewer = ({
  src,
  questionID,
  hdrEnvUrl,
  background = "white",
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 0.2,
  maxDistance = 6,
  maxPolarAngle = Math.PI / 2,
  initialView = "front",
  frontIsNegZ = true,
  exposure = 1.0,
  envIntensity = 1.0,
  ambientIntensity = 0.25,
  hemiIntensity = 0.45,
  envResolution = 256,
  onAttachControls,
  onMeshOver,
  onMeshOut,
  onMeshClick,
  onFit,
}: Interactive3DModelViewerProps) => {
  const isMobile = useIsMobile();
  const controlsRef = useRef<any>(null);
  const [modelRoot, setModelRoot] = useState<THREE.Object3D | null>(null);
  const analyticsRef = useRef<AnalyticsBridgeApi | null>(null);

  const validSrc = useMemo(() => {
    if (!src || typeof src !== "string") return null;
    const s = src.trim();
    if (!s) return null;
    const lower = s.toLowerCase();
    return lower.endsWith(".glb") || lower.endsWith(".gltf") ? s : null;
  }, [src]);

  useEffect(() => {
    if (validSrc)
      try {
        (useGLTF as any).preload?.(validSrc);
      } catch {}
  }, [validSrc]);

  if (!validSrc) {
    return (
      <div
        className="h-full w-full"
        style={{
          background,
          minHeight: 360,
        }}
      >
        Loading 3D model …
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full"
      style={{
        background,
        minHeight: 360,
      }}
    >
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        // shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          // logarithmicDepthBuffer: false,
        }}
        frameloop="demand"
        style={{ position: "absolute", inset: 0 }}
        camera={{ fov: 50, near: 0.05, far: 1000, position: [1.2, 1.1, 1.3] }}
      >
        <Scene
          isMobile={isMobile}
          validSrc={validSrc}
          questionID={questionID!}
          hdrEnvUrl={hdrEnvUrl}
          background={background}
          exposure={exposure}
          ambientIntensity={ambientIntensity}
          hemiIntensity={hemiIntensity}
          envResolution={envResolution}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          minDistance={minDistance}
          maxDistance={maxDistance}
          maxPolarAngle={maxPolarAngle}
          initialView={initialView}
          frontIsNegZ={frontIsNegZ}
          onAttachControls={onAttachControls}
          onMeshOver={onMeshOver}
          onMeshOut={onMeshOut}
          onMeshClick={onMeshClick}
          onFit={onFit}
          controlsRef={controlsRef}
          analyticsRef={analyticsRef}
          setModelRoot={setModelRoot}
          modelRoot={modelRoot}
        />
      </Canvas>
    </div>
  );
};
