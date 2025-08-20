import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import {
  OrbitControls,
  useGLTF,
  Environment,
  Bounds,
  Html,
  useBounds,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Focus } from "lucide-react";
import * as THREE from "three";
import type {
  CachedModelProps,
  InitialViewParams,
  Interactive3DModelViewerProps,
  Model3DParams,
  SetInitialViewParams,
  ViewName,
} from "@/types/question";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AnalyticsBridge3DModel } from "@/utils/analyticsBridge3DModel";
import type { AnalyticsBridgeApi } from "@/types/analytics";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

function tuneCameraForBounds(cam: THREE.PerspectiveCamera, box: THREE.Box3) {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = 0.5 * Math.max(size.x, size.y, size.z);

  // Keep near not absurdly tiny (depth precision improves).
  // CHANGED: formerly near was fixed small in Canvas; now dynamic:
  cam.near = Math.max(0.01, radius / 1000); // ~1e-3 of radius
  cam.far = Math.max(cam.near + 1, radius * 100); // generous but finite
  cam.updateProjectionMatrix();

  // If camera accidentally starts inside the model, push it out a bit
  const toCam = cam.position.clone().sub(center);
  if (toCam.length() < radius * 1.2) {
    toCam.setLength(Math.max(radius * 2.0, cam.near * 10));
    cam.position.copy(center.clone().add(toCam));
  }
}

function setInitialView({
  camera,
  controls,
  object,
  view = "front",
  fov = 50,
  aspect = 16 / 9,
  padding = 1.15,
  frontIsNegZ = true,
}: SetInitialViewParams) {
  // 1) Bounds
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);

  // 2) Direction for each named view (in model space)
  const dirs: Record<ViewName, THREE.Vector3> = {
    front: new THREE.Vector3(0, 0, frontIsNegZ ? -1 : 1),
    back: new THREE.Vector3(0, 0, frontIsNegZ ? 1 : -1),
    left: new THREE.Vector3(-1, 0, 0),
    right: new THREE.Vector3(1, 0, 0),
    top: new THREE.Vector3(0, 1, 0),
    bottom: new THREE.Vector3(0, -1, 0),
  };
  const dir = dirs[view].clone().normalize();

  // 3) Distance to fit (account for FOV + aspect)
  const vFov = (fov * Math.PI) / 180; // vertical FOV in radians
  const fitHeightDist = (maxSize * padding) / (2 * Math.tan(vFov / 2));
  const fitWidthDist = (maxSize * padding) / (2 * Math.tan(Math.atan(Math.tan(vFov / 2) * aspect)));
  const distance = Math.max(fitHeightDist, fitWidthDist);

  // 4) Position camera and set target
  const position = center.clone().add(dir.multiplyScalar(distance));
  camera.position.copy(position);
  controls.target.copy(center);
  controls.update();
}

function RendererSettings({ exposure }: { exposure: number }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);
  return null;
}

/* ========= Model ========= */
function Model({
  src,
  onReady,
  onMeshOver,
  onMeshOut,
  onMeshClick,
  onFit,
}: Readonly<Model3DParams>) {
  const { scene } = useGLTF(src, true);

  const { gl } = useThree(); // CHANGED: to set anisotropy per texture

  useEffect(() => {
    const maxAniso = Math.min(8, gl.capabilities.getMaxAnisotropy?.() || 1);

    scene.traverse((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          const mm = m as any;
          const texKeys = [
            "map",
            "normalMap",
            "roughnessMap",
            "metalnessMap",
            "aoMap",
            "emissiveMap",
          ];
          for (const k of texKeys) {
            const t = mm?.[k] as THREE.Texture | undefined;
            if (t && "anisotropy" in t) t.anisotropy = maxAniso;
          }
        }
      }
    });

    onReady?.(scene);
  }, [scene, onReady, src, gl]);

  const handleOver = (e: ThreeEvent<PointerEvent>) =>
    onMeshOver?.(e.object.name || e.object.uuid || "unknown", e);
  const handleOut = (e: ThreeEvent<PointerEvent>) =>
    onMeshOut?.(e.object.name || e.object.uuid || "unknown", e);
  const handleClick = (e: ThreeEvent<PointerEvent>) =>
    onMeshClick?.(e.object.name || e.object.uuid || "unknown", e);

  return (
    <Bounds observe margin={1.1}>
      <primitive
        object={scene}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      />
      <RefocusButtons onFit={onFit} />
    </Bounds>
  );
}

/* ========= Overlay buttons ========= */
function RefocusButtons({ onFit }: { onFit?: () => void }) {
  const bounds = useBounds(); // provided by <Bounds>
  const { camera } = useThree();
  const controls = useThree((s) => s.controls) as any;

  // Capture initial camera & target once (the “Home” pose)
  const initialCam = useRef(camera.position.clone());
  const initialTarget = useRef(new THREE.Vector3());
  useEffect(() => {
    if (controls && controls.target) initialTarget.current.copy(controls.target);
    initialCam.current.copy(camera.position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frameAll = () => {
    // Recompute model bounds and fit camera nicely (on-demand, no race)
    bounds.refresh().fit();
    onFit?.();
  };

  return (
    <Html transform={false} fullscreen>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 8,
          pointerEvents: "auto",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <button
          onClick={frameAll}
          title="Fit to view"
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            color: "black",
            border: "1px solid rgba(0,0,0,.12)",
            background: "rgba(255,255,255,.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            cursor: "pointer",
          }}
        >
          <Focus />
        </button>
      </div>
    </Html>
  );
}

function FitButton({ onFit }: { onFit?: () => void }) {
  const bounds = useBounds();
  const onClick = () => {
    bounds.refresh().fit();
    onFit?.();
  };
  return (
    <Html transform={false} fullscreen>
      <div style={{ position: "absolute", top: 10, right: 10, pointerEvents: "auto" }}>
        <button
          onClick={onClick}
          title="Fit to view"
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            color: "black",
            border: "1px solid rgba(0,0,0,.12)",
            background: "rgba(255,255,255,.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            cursor: "pointer",
          }}
        >
          <Focus />
        </button>
      </div>
    </Html>
  );
}

export function CachedModel({
  url,
  onReady,
  onPointerOver,
  onPointerOut,
  onClick,
  onFit,
}: CachedModelProps) {
  const isMobile = useIsMobile();
  // Pull from drei's GLTF cache (no re-decode after first load)
  const gltf = useGLTF(url, true) as unknown as { scene: THREE.Object3D };

  // Clone the cached scene so each usage has its own instance
  const root = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  // One-time scene/material tuning for perf
  useEffect(() => {
    const allowedAniso = isMobile ? 2 : 8; // keep small on mobile, modest on desktop
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      // Turn off dynamic shadows entirely (expensive on mobile)
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      // Tweak textures on any materials found
      const mat = (mesh as any).material;
      const mats: THREE.Material[] = Array.isArray(mat) ? mat : mat ? [mat] : [];

      for (const m of mats) {
        const mm = m as any;
        const texKeys = [
          "map",
          "normalMap",
          "roughnessMap",
          "metalnessMap",
          "aoMap",
          "emissiveMap",
        ];
        for (const k of texKeys) {
          const t = mm?.[k] as THREE.Texture | undefined;
          if (t && "anisotropy" in t) {
            t.anisotropy = allowedAniso;
            // Optional: improve sampling defaults a bit
            t.minFilter = THREE.LinearMipmapLinearFilter;
            t.magFilter = THREE.LinearFilter;
          }
        }
      }
    });

    onReady?.(root);
  }, [root, isMobile, onReady]);

  return (
    <Bounds observe margin={1.1}>
      <primitive
        object={root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      />
      {/* Optional: keep the convenient FIT control and hook into analytics */}
      <FitButton onFit={onFit} />
    </Bounds>
  );
}

/* ========= Apply initial view once object exists ========= */
function InitialViewApplier({ object, initialView, frontIsNegZ, controlsRef }: InitialViewParams) {
  const { camera, size } = useThree();
  const appliedRef = useRef(false);

  // CHANGED: when the model root `object` changes (next question), allow re‑apply once again
  useEffect(() => {
    appliedRef.current = false; // CHANGED
  }, [object]);

  useEffect(() => {
    if (!object || !controlsRef.current || appliedRef.current) return;
    appliedRef.current = true;

    const controls = controlsRef.current;
    const aspect = size.width / Math.max(1, size.height);
    const cam = camera as THREE.PerspectiveCamera;

    // 1) Bounds
    const box = new THREE.Box3().setFromObject(object);
    const sizeV = box.getSize(new THREE.Vector3());
    const radius = 0.5 * Math.max(sizeV.x, sizeV.y, sizeV.z) || 1; // CHANGED

    // 2) Tune camera near/far to the model
    tuneCameraForBounds(cam, box);

    // 3) CHANGED: set per‑model zoom limits so dolly/pinch always works
    const minDist = Math.max(0.05, radius * 0.25); // close‑up
    const maxDist = radius * 12; // far‑out
    controls.minDistance = minDist; // CHANGED
    controls.maxDistance = maxDist; // CHANGED
    controls.enableZoom = true; // CHANGED (explicit)
    controls.update?.();

    // 4) Apply your initial view framing
    setInitialView({
      camera: cam,
      controls,
      object,
      view: initialView,
      fov: cam.fov,
      aspect,
      frontIsNegZ,
    });
  }, [object, controlsRef, size, camera, initialView, frontIsNegZ]);

  return null;
}

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
  const { invalidate } = useThree();
  const dprCAP = isMobile ? 1.25 : 1.5;

  const analyticsRef = useRef<AnalyticsBridgeApi | null>(null);

  const validSrc = useMemo(() => {
    if (!src || typeof src !== "string") return null;
    const s = src.trim();
    if (!s) return null;
    const lower = s.toLowerCase();
    return lower.endsWith(".glb") || lower.endsWith(".gltf") ? s : null;
  }, [src]);

  const [modelRoot, setModelRoot] = useState<THREE.Object3D | null>(null);
  const controlsRef = useRef<any>(null);
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, dprCAP) : 1;

  // useEffect(() => {
  //   if (!validSrc) return;
  //   const current = validSrc;
  //   try {
  //     (useGLTF as any).preload?.(current);
  //   } catch (error) {
  //     console.warn("Failed to preload GLTF model:", error);
  //   }
  // }, [validSrc]);

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

  useFrame(() => {
    if (autoRotate) invalidate();
  });

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
        <color attach="background" args={[background || "#ffffff"]} />

        <PerformanceMonitor />

        <RendererSettings exposure={exposure} />

        <AnalyticsBridge3DModel
          questionID={questionID!}
          onReady={(api) => {
            analyticsRef.current = api;
            // optional: expose to window for ad-hoc debugging
            (window as any).__r3f_collect__ = api.collectR3F;
          }}
        />

        {/* Lights (fine outside Suspense) */}
        <ambientLight intensity={ambientIntensity} />
        <hemisphereLight intensity={hemiIntensity} groundColor="white" />
        {/* <directionalLight position={[3, 5, 2]} intensity={0.8} castShadow /> */}

        <Suspense fallback={null /* or a small spinner/overlay if you prefer */}>
          {hdrEnvUrl ? (
            <Environment
              files={hdrEnvUrl}
              background={false}
              /* CHANGED: small res for mobile */ resolution={isMobile ? 256 : 512}
            />
          ) : (
            <Environment preset="city" background={false} resolution={256} /> // CHANGED: fallback if no URL
          )}

          {/* Model */}
          {/* <Model
            src={src}
            onReady={setModelRoot}
            onMeshOver={(name, e) => {
              analyticsRef.current?.onMeshOver(name, e);
              onMeshOver?.(name, e);
            }}
            onMeshOut={(name, e) => {
              analyticsRef.current?.onMeshOut(name, e);
              onMeshOut?.(name, e);
            }}
            onMeshClick={(name, e) => {
              analyticsRef.current?.onMeshClick(name, e);
              onMeshClick?.(name, e);
            }}
            onFit={() => {
              analyticsRef.current?.onFit();
              onFit?.();
            }}
          /> */}

          <CachedModel
            url={validSrc}
            onReady={(obj: THREE.Object3D) => {
              // fit/tune once
              setModelRoot(obj);
              invalidate(); // render after ready
            }}
            onPointerOver={(e: any) => {
              onMeshOver?.(e.object.name || e.object.uuid, e);
            }}
            onPointerOut={(e: any) => {
              onMeshOut?.(e.object.name || e.object.uuid, e);
            }}
            onClick={(e: any) => {
              onMeshClick?.(e.object.name || e.object.uuid, e);
            }}
            onFit={() => {
              analyticsRef.current?.onFit();
              onFit?.();
            }}
          />

          {/* Apply initial view exactly once when model is ready */}
          <InitialViewApplier
            object={modelRoot}
            initialView={initialView}
            frontIsNegZ={frontIsNegZ}
            controlsRef={controlsRef}
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          ref={(c) => {
            controlsRef.current = c;
            analyticsRef.current?.attachControls(c);
            onAttachControls?.(c);
          }}
          makeDefault
          onChange={() => invalidate()}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          zoomSpeed={0.9}
          minDistance={Math.max(minDistance, 0.5)}
          maxDistance={maxDistance}
          maxPolarAngle={maxPolarAngle}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>
    </div>
  );
};
