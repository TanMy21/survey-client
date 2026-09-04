import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useGLTF,
  useEnvironment,
  useProgress,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useModel3DTelemetry } from "@/context/Model3DTelemetryContext";

import type { AnalyticsBridgeApi } from "@/types/analyticsTypes";
import type { Interactive3DModelViewerProps } from "@/types/questionTypes";

import Scene from "./Scene";
import Model3dLoader from "../loader/Model3dLoader";

import {
  Model3DErrorBoundary,
  classify3DError,
} from "./Model3DErrorBoundary";

import { Model3DRenderMonitor } from "./Model3DRenderMonitor";

function LoaderOverlay() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/70">
      Loading 3D model... {Math.round(progress)}%
    </div>
  );
}

export function Interactive3DModelViewer(
  props: Interactive3DModelViewerProps
) {
  const { attemptNumber } = useModel3DTelemetry();

  return (
    <ViewerAttempt key={attemptNumber} {...props} />
  );
}

function ViewerAttempt({
  src,
  questionID,
  hdrEnvUrl,
  background = "white",
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 0.2,
  maxDistance = 6,
  maxPolarAngle = Math.PI - 0.01,
  initialView = "front",
  frontIsNegZ = true,
  exposure = 1,
  ambientIntensity = 0.25,
  hemiIntensity = 0.45,
  envResolution = 256,
  onCollectReady,
  onAttachControls,
  onMeshOver,
  onMeshOut,
  onMeshClick,
  onFit,
}: Interactive3DModelViewerProps) {
  const isMobile = useIsMobile();

  const {
    visit,
    attemptNumber,
    retry,
  } = useModel3DTelemetry();

  const controlsRef = useRef<any>(null);

  const analyticsRef =
    useRef<AnalyticsBridgeApi | null>(null);

  const [modelRoot, setModelRoot] =
    useState<THREE.Object3D | null>(null);

  const [problem, setProblem] =
    useState<string | null>(null);

  const [
    initializationFailed,
    setInitializationFailed,
  ] = useState(false);

  const initializationError = useRef<unknown>(null);

  const validSrc = useMemo(() => {
    if (!src?.trim()) return null;

    try {
      const url = new URL(
        src.trim(),
        window.location.href
      );

      return [
        "http:",
        "https:",
        "blob:",
        "data:",
      ].includes(url.protocol)
        ? url.href
        : null;
    } catch {
      return null;
    }
  }, [src]);

  const onProblem = useCallback(
    (message: string) => setProblem(message),
    []
  );

  const onHealthy = useCallback(
    () => setProblem(null),
    []
  );

  useLayoutEffect(() => {
    // R3F 9.3 configures its renderer asynchronously.
    // Handle only our own already-reported initialization
    // rejection, never unrelated promise rejections.
    const handler = (event: PromiseRejectionEvent) => {
      if (
        initializationError.current &&
        event.reason === initializationError.current
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener(
      "unhandledrejection",
      handler
    );

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handler
      );
    };
  }, []);

  useLayoutEffect(() => {
    if (!validSrc) {
      visit.error(attemptNumber, {
        errorCode: src?.trim()
          ? "MODEL_URL_INVALID"
          : "MODEL_URL_MISSING",
        stage: "LOAD",
        assetType: "MODEL",
        message:
          "The model URL is missing or invalid.",
      });

      onProblem(
        "The 3D model URL is missing or invalid."
      );

      return;
    }

    visit.start(attemptNumber);

    const timeout = setTimeout(() => {
      if (
        attemptNumber !== visit.attemptNumber ||
        visit.hasError ||
        (visit.loaded && visit.environmentLoaded)
      ) {
        return;
      }

      visit.error(attemptNumber, {
        errorCode: "LOAD_TIMEOUT",
        stage: "LOAD",
        assetType: visit.loaded
          ? "ENVIRONMENT"
          : "MODEL",
        message:
          "Required 3D assets were not ready within 45 seconds.",
      });

      onProblem(
        "The 3D model is taking longer than expected. You can retry."
      );
    }, 45_000);

    return () => clearTimeout(timeout);
  }, [
    validSrc,
    src,
    visit,
    attemptNumber,
    onProblem,
  ]);

  const retryViewer = () => {
    if (validSrc) {
      useGLTF.clear(validSrc);
    }

    useEnvironment.clear(
      hdrEnvUrl
        ? { files: hdrEnvUrl }
        : { preset: "city" }
    );

    onCollectReady?.(undefined);
    retry();
  };

  return (
    <div
      className="h-smm:h-[60vh] h-sm:h-[50vh] h-lg:h-[60vh] relative w-full"
      data-ignore-scrollnav
      style={{
        background,
        minHeight: 200,
      }}
    >
      <LoaderOverlay />

      {validSrc && !initializationFailed && (
        <Model3DErrorBoundary
          onError={(error) => {
            visit.error(
              attemptNumber,
              classify3DError(error, "VIEWER")
            );

            onProblem(
              "The 3D viewer encountered a problem. Please retry."
            );
          }}
        >
          <Canvas
            dpr={
              isMobile
                ? [1, 1.25]
                : [1, 1.5]
            }
            gl={(defaults) => {
              let contextUnavailable = false;

              const failed = () => {
                contextUnavailable = true;
              };

              defaults.canvas.addEventListener(
                "webglcontextcreationerror",
                failed
              );

              try {
                return new THREE.WebGLRenderer({
                  ...defaults,
                  antialias: true,
                  alpha: false,
                  powerPreference: "high-performance",
                });
              } catch (error) {
                initializationError.current = error;

                visit.error(attemptNumber, {
                  errorCode:
                    contextUnavailable ||
                    /Error creating WebGL2? context/i.test(
                      String(error)
                    )
                      ? "WEBGL_UNAVAILABLE"
                      : "RENDERER_ERROR",
                  stage: "RENDERER_INIT",
                  message:
                    error instanceof Error
                      ? error.message
                      : String(error),
                });

                setInitializationFailed(true);

                onProblem(
                  "3D graphics could not start on this device. You can retry."
                );

                throw error;
              } finally {
                defaults.canvas.removeEventListener(
                  "webglcontextcreationerror",
                  failed
                );
              }
            }}
            frameloop="demand"
            style={{
              position: "absolute",
              inset: 0,
            }}
            camera={{
              fov: 50,
              near: 0.05,
              far: 1000,
              position: [1.2, 1.1, 1.3],
            }}
            onPointerMissed={(event) => {
              analyticsRef.current
                ?.recordEmptySpaceClick?.(event);
            }}
          >
            <Model3DRenderMonitor
              modelRoot={modelRoot}
              onProblem={onProblem}
              onHealthy={onHealthy}
            />

            <Suspense fallback={<Model3dLoader />}>
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
                onCollectReady={onCollectReady}
                onAttachControls={onAttachControls}
                onMeshOver={onMeshOver}
                onMeshOut={onMeshOut}
                onMeshClick={onMeshClick}
                onFit={onFit}
                controlsRef={controlsRef}
                analyticsRef={analyticsRef}
                setModelRoot={setModelRoot}
                modelRoot={modelRoot}
                onTechnicalError={onProblem}
              />
            </Suspense>
          </Canvas>
        </Model3DErrorBoundary>
      )}

      {problem && (
        <div
          role="alert"
          className="absolute right-2 bottom-2 left-2 z-20 rounded bg-white/95 p-3 text-sm text-gray-900 shadow"
        >
          <p>{problem}</p>

          <button
            type="button"
            className="mt-2 rounded border px-3 py-1"
            onClick={retryViewer}
          >
            Retry 3D model
          </button>
        </div>
      )}
    </div>
  );
}