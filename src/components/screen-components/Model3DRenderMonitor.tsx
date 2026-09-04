import {
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import type * as THREE from "three";

import { useModel3DTelemetry } from "@/context/Model3DTelemetryContext";

export function Model3DRenderMonitor({
  modelRoot,
  onProblem,
  onHealthy,
}: {
  modelRoot: THREE.Object3D | null;
  onProblem: (message: string) => void;
  onHealthy: () => void;
}) {
  const { gl, invalidate } = useThree();

  const {
    visit,
    attemptNumber,
  } = useModel3DTelemetry();

  const drewModel = useRef(false);
  const shaderFailed = useRef(false);

  const objects = useMemo(() => {
    const set = new Set<THREE.Object3D>();

    modelRoot?.traverse((object) => set.add(object));

    return set;
  }, [modelRoot]);

  useLayoutEffect(() => {
    const originalDraw = gl.renderBufferDirect;
    const originalShaderError = gl.debug.onShaderError;
    const originalCheck = gl.debug.checkShaderErrors;

    gl.renderBufferDirect = function (...args) {
      const before = gl.info.render.calls;

      originalDraw.apply(gl, args);

      if (
        objects.has(args[4]) &&
        gl.getRenderTarget() === null &&
        gl.info.render.calls > before
      ) {
        drewModel.current = true;
      }
    };

    gl.debug.checkShaderErrors = true;

    gl.debug.onShaderError = (
      context,
      program,
      vertex,
      fragment
    ) => {
      shaderFailed.current = true;

      visit.error(attemptNumber, {
        errorCode: "SHADER_ERROR",
        stage: "RENDER",
        message:
          [
            context.getProgramInfoLog(program),
            context.getShaderInfoLog(vertex),
            context.getShaderInfoLog(fragment),
          ]
            .filter(Boolean)
            .join("\n") ||
          "Shader compilation or linking failed.",
      });

      onProblem(
        "The 3D model could not be rendered. Please retry."
      );

      originalShaderError?.(
        context,
        program,
        vertex,
        fragment
      );
    };

    const lost = (event: Event) => {
      event.preventDefault();

      visit.contextLost(attemptNumber);

      onProblem(
        "The 3D display was interrupted. Waiting for recovery..."
      );
    };

    const restored = () => {
      shaderFailed.current = false;

      visit.contextRestored(attemptNumber);
      invalidate();
    };

    const canvas = gl.domElement;

    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener(
      "webglcontextrestored",
      restored
    );

    invalidate();

    return () => {
      canvas.removeEventListener(
        "webglcontextlost",
        lost
      );

      canvas.removeEventListener(
        "webglcontextrestored",
        restored
      );

      gl.renderBufferDirect = originalDraw;
      gl.debug.onShaderError = originalShaderError;
      gl.debug.checkShaderErrors = originalCheck;
    };
  }, [
    gl,
    invalidate,
    objects,
    visit,
    attemptNumber,
    onProblem,
  ]);

  // Run the existing render pass after controls update.
  useFrame((state) => {
    if (state.gl.getContext().isContextLost()) return;

    drewModel.current = false;

    try {
      state.gl.render(state.scene, state.camera);

      if (
        drewModel.current &&
        !shaderFailed.current &&
        !state.gl.getContext().isContextLost() &&
        visit.frameRendered(attemptNumber) &&
        !visit.hasError
      ) {
        onHealthy();
      }
    } catch (error) {
      visit.error(attemptNumber, {
        errorCode: "RENDERER_ERROR",
        stage: "RENDER",
        message:
          error instanceof Error
            ? error.message
            : String(error),
      });

      onProblem(
        "The 3D model could not be rendered. Please retry."
      );
    }
  }, 1);

  return null;
}