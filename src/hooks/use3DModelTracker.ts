import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { OrbitControls } from "three-stdlib";

export function use3DModelTracker(questionID: string) {
  const { gl, camera, size } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  // fps sampling (~1.5 Hz)
  const samples = useRef<number[]>([]);
  let last = performance.now();
  useFrame(() => {
    const now = performance.now();
    const dt = now - last;
    last = now;
    const fps = 1000 / Math.max(1, dt);
    if (samples.current.length % 6 === 0) samples.current.push(Math.round(fps));
  });

  // orbit stats + coverage buckets
  const orbit = useRef({
    starts: 0,
    changes: 0,
    ends: 0,
    azBins: new Set<number>(),
    elBins: new Set<number>(),
    resets: 0,
    fits: 0,
  });

  const attachControls = (c: OrbitControls | null) => {
    controlsRef.current = c;
    if (!c) return;
    const onStart = () => {
      orbit.current.starts++;
    };
    const onChange = () => {
      orbit.current.changes++;
      const az = c.getAzimuthalAngle?.() ?? 0; // [-PI, PI]
      const el = c.getPolarAngle?.() ?? Math.PI / 2; // [0, PI]
      orbit.current.azBins.add(Math.round(((az + Math.PI) / (2 * Math.PI)) * 8));
      orbit.current.elBins.add(Math.round((el / Math.PI) * 4));
    };
    const onEnd = () => {
      orbit.current.ends++;
    };
    c.addEventListener("start", onStart);
    c.addEventListener("change", onChange);
    c.addEventListener("end", onEnd);
    return () => {
      c.removeEventListener("start", onStart);
      c.removeEventListener("change", onChange);
      c.removeEventListener("end", onEnd);
    };
  };

  // mesh hovers/clicks
  const hoverStart = useRef<Record<string, number>>({});
  const hoverDur = useRef<Record<string, number>>({});
  const meshClicks = useRef<Record<string, number>>({});
  const onMeshOver = (name: string) => {
    hoverStart.current[name] ??= performance.now();
  };
  const onMeshOut = (name: string) => {
    const s = hoverStart.current[name];
    if (s != null) {
      hoverDur.current[name] = (hoverDur.current[name] ?? 0) + (performance.now() - s);
      delete hoverStart.current[name];
    }
  };
  const onMeshClick = (name: string) => {
    meshClicks.current[name] = (meshClicks.current[name] ?? 0) + 1;
  };

  const onFit = () => {
    orbit.current.fits++;
  };
  const onReset = () => {
    orbit.current.resets++;
  };

  const collectR3F = () => {
    // close open hovers
    Object.keys(hoverStart.current).forEach(onMeshOut);
    const info = gl.info;
    const arr = samples.current.slice().sort((a, b) => a - b);
    const p95 = arr.length ? arr[Math.floor(0.95 * (arr.length - 1))] : null;

    return {
      questionID,
      orbit: {
        starts: orbit.current.starts,
        changes: orbit.current.changes,
        ends: orbit.current.ends,
        azimuthCoverage: orbit.current.azBins.size,
        elevationCoverage: orbit.current.elBins.size,
        resets: orbit.current.resets,
        fits: orbit.current.fits,
      },
      model: {
        meshHoverMs: hoverDur.current,
        meshClicks: meshClicks.current,
      },
      perf: {
        fps_avg: Math.round(
          samples.current.reduce((a, b) => a + b, 0) / Math.max(1, samples.current.length)
        ),
        fps_min: arr[0] ?? null,
        fps_p95: p95,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        lines: info.render.lines,
        points: info.render.points,
        memGeometries: info.memory.geometries,
        memTextures: info.memory.textures,
        pixelRatio: gl.getPixelRatio(),
        canvas: { w: size.width, h: size.height },
      },
    };
  };

  return {
    attachControls,
    onMeshOver,
    onMeshOut,
    onMeshClick,
    onFit,
    onReset,
    collectR3F,
  };
}
