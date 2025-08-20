import type { SceneProps } from "@/types/model3D";
import type { InitialViewParams, SetInitialViewParams, ViewName } from "@/types/question";
import { AnalyticsBridge3DModel } from "@/utils/analyticsBridge3DModel";
import { Environment, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { Object3D } from "three";
import * as THREE from "three";
import { CachedModel } from "./CachedModel";

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

const Scene = ({
  isMobile,
  validSrc,
  questionID,
  hdrEnvUrl,
  background,
  exposure,
  ambientIntensity,
  hemiIntensity,
  envResolution,
  autoRotate,
  autoRotateSpeed,
  minDistance,
  maxDistance,
  maxPolarAngle,
  initialView,
  frontIsNegZ,
  onAttachControls,
  onMeshOver,
  onMeshOut,
  onMeshClick,
  onFit,
  controlsRef,
  analyticsRef,
  setModelRoot,
  modelRoot,
}: SceneProps) => {
  const invalidate = useThree((s) => s.invalidate);

  // drive frames only when autoRotate is on
  useFrame(() => {
    if (autoRotate) invalidate();
  });

  return (
    <>
      <color attach="background" args={[background || "#ffffff"]} />
      <PerformanceMonitor />

      <RendererSettings exposure={exposure} />

      <AnalyticsBridge3DModel
        questionID={questionID}
        onReady={(api) => {
          analyticsRef.current = api;
          (window as any).__r3f_collect__ = api.collectR3F;
        }}
      />

      {/* modest lights */}
      <ambientLight intensity={ambientIntensity} />
      <hemisphereLight intensity={hemiIntensity} groundColor="white" />

      <Suspense fallback={null}>
        {hdrEnvUrl ? (
          <Environment files={hdrEnvUrl} background={false} resolution={isMobile ? 256 : 512} />
        ) : (
          <Environment preset="city" background={false} resolution={256} />
        )}

        <CachedModel
          url={validSrc}
          onReady={(obj: Object3D) => {
            setModelRoot(obj);
            invalidate();
          }}
          onPointerOver={(e: any) => onMeshOver?.(e.object.name || e.object.uuid, e)}
          onPointerOut={(e: any) => onMeshOut?.(e.object.name || e.object.uuid, e)}
          onClick={(e: any) => onMeshClick?.(e.object.name || e.object.uuid, e)}
          onFit={() => {
            analyticsRef.current?.onFit();
            onFit?.();
          }}
        />

        <InitialViewApplier
          object={modelRoot}
          initialView={initialView}
          frontIsNegZ={frontIsNegZ}
          controlsRef={controlsRef}
        />
      </Suspense>

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
    </>
  );
};

export default Scene;
