import type { SurfaceClickSample } from "@/types/analyticsTypes";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { OrbitControls } from "three-stdlib";

//  This hook tracks user interactions with a 3D model, including camera movements and clicks.
//  It provides an API for your 3D question component to report interactions and collect analytics data.
function getScreenZone(clientX: number, clientY: number, canvasRect: DOMRect): string {
  const relativeX = clientX - canvasRect.left;
  const relativeY = clientY - canvasRect.top;

  const col =
    relativeX < canvasRect.width / 3
      ? "left"
      : relativeX < (canvasRect.width * 2) / 3
        ? "center"
        : "right";

  const row =
    relativeY < canvasRect.height / 3
      ? "top"
      : relativeY < (canvasRect.height * 2) / 3
        ? "middle"
        : "bottom";

  return `${row}-${col}`;
}

// Captures a compact camera/orbit state from OrbitControls.
// to find the user's viewing angle and zoom distance.
function getCameraState(controls: OrbitControls | null) {
  if (!controls?.object || !controls?.target) {
    return null;
  }

  const camera = controls.object;
  const target = controls.target;

  return {
    azimuth: controls.getAzimuthalAngle?.() ?? null,
    polar: controls.getPolarAngle?.() ?? null,
    distance: camera.position.distanceTo(target),
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: target.x,
      y: target.y,
      z: target.z,
    },
  };
}

// Calculates the absolute difference between two numeric values.
//To detect meaningful zoom/camera distance changes.
function getAbsDiff(a: number | null | undefined, b: number | null | undefined) {
  if (typeof a !== "number" || typeof b !== "number") return 0;
  return Math.abs(a - b);
}

// Extracts client pointer coordinates from a React Three Fiber event.
function getClientPoint(event: any) {
  const clientX =
    typeof event?.clientX === "number"
      ? event.clientX
      : typeof event?.nativeEvent?.clientX === "number"
        ? event.nativeEvent.clientX
        : typeof event?.sourceEvent?.clientX === "number"
          ? event.sourceEvent.clientX
          : null;

  const clientY =
    typeof event?.clientY === "number"
      ? event.clientY
      : typeof event?.nativeEvent?.clientY === "number"
        ? event.nativeEvent.clientY
        : typeof event?.sourceEvent?.clientY === "number"
          ? event.sourceEvent.clientY
          : null;

  return { clientX, clientY };
}

export function use3DModelTracker(questionID: string) {
  const { gl, size } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  // Stores click counts by generic 3x3 screen zone.
  const screenZoneClickSummaryRef = useRef<Record<string, number>>({});

  // Stores the start time of this 3D question tracking session.
  const startedAtRef = useRef<number>(performance.now());

  // Stores exact clicked surface points on the 3D model.
  const surfaceClickSamplesRef = useRef<SurfaceClickSample[]>([]);

  const emptySpaceClickCountRef = useRef<number>(0);

  // Stores basic empty-space click samples.
  const emptySpaceClickSamplesRef = useRef<
    {
      t: number;
      clientX: number | null;
      clientY: number | null;
      screenZoneId: string | null;
    }[]
  >([]);

  // fps sampling (~1.5 Hz)
  const samples = useRef<number[]>([]);
  const lastRef = useRef<number>(performance.now());

  // Counts rendered frames so FPS can be sampled at a lower frequency.
  const frameCountRef = useRef(0);

  useFrame(() => {
    const now = performance.now();
    const dt = now - lastRef.current;
    lastRef.current = now;

    const fps = 1000 / Math.max(1, dt);

    frameCountRef.current++;

    // Samples FPS at a low frequency to avoid collecting noisy/high-volume data.
    if (frameCountRef.current % 6 === 0) {
      samples.current.push(Math.round(fps));
    }
  });

  // orbit stats + coverage buckets
  const orbit = useRef({
    starts: 0,
    ends: 0,

    manualChangeCount: 0,
    passiveChangeCount: 0,

    manualAzBins: new Set<number>(),
    manualElBins: new Set<number>(),

    passiveAzBins: new Set<number>(),
    passiveElBins: new Set<number>(),

    resets: 0,
    fits: 0,
  });

  // Tracks whether the user is currently performing an orbit/zoom/pan gesture.
  const isUserControllingRef = useRef(false);

  // Stores the first camera state after controls are attached.
  const initialCameraStateRef = useRef<ReturnType<typeof getCameraState> | null>(null);

  // Stores the latest camera state before answer submission.

  const latestCameraStateRef = useRef<ReturnType<typeof getCameraState> | null>(null);

  // Tracks zoom-specific behavior using camera distance changes.

  const zoomRef = useRef({
    zoomChangeCount: 0,
    minCameraDistance: null as number | null,
    maxCameraDistance: null as number | null,
    deepZoomUsed: false,
  });

  // Stores the previous camera distance so zoom changes can be detected.

  const previousCameraDistanceRef = useRef<number | null>(null);

  // Attaches OrbitControls so orbit/rotation behavior can be tracked.
  // This captures exploration patterns like rotation count and angle coverage.
  const attachControls = (c: OrbitControls | null) => {
    controlsRef.current = c;
    if (!c) return;

    // Captures initial camera state once controls are available.
    const initialState = getCameraState(c);
    initialCameraStateRef.current = initialState;
    latestCameraStateRef.current = initialState;

    if (typeof initialState?.distance === "number") {
      previousCameraDistanceRef.current = initialState.distance;
      zoomRef.current.minCameraDistance = initialState.distance;
      zoomRef.current.maxCameraDistance = initialState.distance;
    }

    const onStart = () => {
      // OrbitControls start is usually user gesture start: rotate, zoom, or pan.
      isUserControllingRef.current = true;
      orbit.current.starts++;
    };

    const onChange = () => {
      const state = getCameraState(c);
      latestCameraStateRef.current = state;

      if (!state) return;

      const az = state.azimuth ?? 0;
      const el = state.polar ?? Math.PI / 2;

      // Buckets horizontal camera coverage into rough regions.
      const azBin = Math.round(((az + Math.PI) / (2 * Math.PI)) * 8);

      // Buckets vertical camera coverage into rough regions.
      const elBin = Math.round((el / Math.PI) * 4);

      if (isUserControllingRef.current) {
        // Tracks only user-driven angle coverage.
        orbit.current.manualAzBins.add(azBin);
        orbit.current.manualElBins.add(elBin);

        // Counts only user-driven camera changes.
        orbit.current.manualChangeCount++;
      } else {
        // Tracks auto-rotate/programmatic angle coverage separately.
        orbit.current.passiveAzBins.add(azBin);
        orbit.current.passiveElBins.add(elBin);

        // Counts passive camera changes separately.
        orbit.current.passiveChangeCount++;
      }

      if (isUserControllingRef.current) {
        // Counts only user-driven camera changes.
        orbit.current.manualChangeCount++;
      } else {
        // Counts auto-rotate/programmatic changes separately.
        orbit.current.passiveChangeCount++;
      }

      const currentDistance = state.distance;
      const previousDistance = previousCameraDistanceRef.current;

      if (typeof currentDistance === "number") {
        zoomRef.current.minCameraDistance =
          zoomRef.current.minCameraDistance == null
            ? currentDistance
            : Math.min(zoomRef.current.minCameraDistance, currentDistance);

        zoomRef.current.maxCameraDistance =
          zoomRef.current.maxCameraDistance == null
            ? currentDistance
            : Math.max(zoomRef.current.maxCameraDistance, currentDistance);

        const ZOOM_DELTA_THRESHOLD = 0.02;

        // Treat distance change as zoom only if it is meaningful enough to avoid noise.
        if (
          isUserControllingRef.current &&
          previousDistance != null &&
          getAbsDiff(currentDistance, previousDistance) > ZOOM_DELTA_THRESHOLD
        ) {
          zoomRef.current.zoomChangeCount++;
        }

        previousCameraDistanceRef.current = currentDistance;
      }
    };

    const onEnd = () => {
      // User gesture ended.
      isUserControllingRef.current = false;
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

  // Tracks when hover starts for a raw mesh/object name.
  const onMeshOver = (name: string) => {
    hoverStart.current[name] ??= performance.now();
  };

  // Tracks hover duration for a raw mesh/object name.
  const onMeshOut = (name: string) => {
    const s = hoverStart.current[name];

    if (s != null) {
      hoverDur.current[name] = (hoverDur.current[name] ?? 0) + (performance.now() - s);
      delete hoverStart.current[name];
    }
  };

  // Tracks simple mesh click counts by raw mesh/object name.
  const onMeshClick = (name: string) => {
    meshClicks.current[name] = (meshClicks.current[name] ?? 0) + 1;
  };

  // Records exact raycast hit data from a React Three Fiber pointer event.
  // This gives you model-surface click samples for future heatmaps.
  const recordSurfaceClick = (event: any) => {
    const material = event.object?.material;
    // Safely extracts screen pointer coordinates from the R3F event.
    const { clientX, clientY } = getClientPoint(event);

    // Handles both normal single-material meshes and material-array meshes.
    const materialName = Array.isArray(material)
      ? material
          .map((m) => m?.name)
          .filter(Boolean)
          .join(",")
      : material?.name || null;

    // Converts the clicked screen position into a generic zone.
    const zoneId =
      clientX != null && clientY != null
        ? getScreenZone(clientX, clientY, gl.domElement.getBoundingClientRect())
        : null;

    if (zoneId) {
      // Counts this model hit in the screen-zone heatmap.
      screenZoneClickSummaryRef.current[zoneId] =
        (screenZoneClickSummaryRef.current[zoneId] ?? 0) + 1;
    }

    surfaceClickSamplesRef.current.push({
      t: Math.round(performance.now() - startedAtRef.current),
      meshName: event.object?.name || event.object?.uuid || null,
      materialName,
      faceIndex: typeof event.faceIndex === "number" ? event.faceIndex : null,
      screenZoneId: zoneId,
      point: {
        x: event.point.x,
        y: event.point.y,
        z: event.point.z,
      },
    });
  };

  // Records clicks inside the viewer that miss the 3D model, giving insight into viewer friction.
  const recordEmptySpaceClick = (event: any) => {
    emptySpaceClickCountRef.current++;

    // Safely extracts screen pointer coordinates from the missed-click event.
    const { clientX, clientY } = getClientPoint(event);

    const zoneId =
      clientX != null && clientY != null
        ? getScreenZone(clientX, clientY, gl.domElement.getBoundingClientRect())
        : null;

    if (zoneId) {
      // Counts this missed click in the screen-zone heatmap.
      screenZoneClickSummaryRef.current[zoneId] =
        (screenZoneClickSummaryRef.current[zoneId] ?? 0) + 1;
    }

    emptySpaceClickSamplesRef.current.push({
      t: Math.round(performance.now() - startedAtRef.current),
      clientX: typeof event?.clientX === "number" ? event.clientX : null,
      clientY: typeof event?.clientY === "number" ? event.clientY : null,
      screenZoneId: zoneId,
    });
  };

  // Tracks model fit action.
  const onFit = () => {
    orbit.current.fits++;
  };

  // Tracks model reset action.
  const onReset = () => {
    orbit.current.resets++;
  };

  // Collects current 3D model behavior data before answer submission.
  // This is called from your response container through window.__r3f_collect__.
  const collectR3F = () => {
    // Closes open hovers so current hover time is included before submission.
    Object.keys(hoverStart.current).forEach(onMeshOut);

    const info = gl.info;
    const arr = samples.current.slice().sort((a, b) => a - b);
    const p95 = arr.length ? arr[Math.floor(0.95 * (arr.length - 1))] : null;

    const clickedMeshNames = Array.from(
      new Set(surfaceClickSamplesRef.current.map((s) => s.meshName).filter(Boolean))
    );

    const clickedMaterialNames = Array.from(
      new Set(surfaceClickSamplesRef.current.map((s) => s.materialName).filter(Boolean))
    );

    // Captures the latest camera state at the time of answer submission.
    const finalCameraState = getCameraState(controlsRef.current) ?? latestCameraStateRef.current;

    // True when participant did not manually rotate, zoom, click model, or click viewer.
    const answeredWithout3DInteraction =
      orbit.current.starts === 0 &&
      zoomRef.current.zoomChangeCount === 0 &&
      surfaceClickSamplesRef.current.length === 0 &&
      emptySpaceClickCountRef.current === 0;

    // User manually viewed more than one meaningful angle.
    const viewedMultipleAngles =
      orbit.current.manualAzBins.size >= 2 || orbit.current.manualElBins.size >= 2;

    // User manually covered most horizontal angle buckets.
    const fullRotationCompleted = orbit.current.manualAzBins.size >= 7;

    // Auto-rotate/passive coverage, useful for debugging but not user behavior.
    const passiveViewedMultipleAngles =
      orbit.current.passiveAzBins.size >= 2 || orbit.current.passiveElBins.size >= 2;

    // Calculates whether the user zoomed meaningfully closer than the starting distance.
    const initialDistance = initialCameraStateRef.current?.distance ?? null;
    const minDistance = zoomRef.current.minCameraDistance;

    const deepZoomUsed =
      typeof initialDistance === "number" &&
      typeof minDistance === "number" &&
      minDistance < initialDistance * 0.75;

    return {
      questionID,
      orbit: {
        starts: orbit.current.starts,
        ends: orbit.current.ends,
        // User-driven camera changes only.
        manualChangeCount: orbit.current.manualChangeCount,

        // Auto-rotate/programmatic camera changes.
        passiveChangeCount: orbit.current.passiveChangeCount,

        // Kept for compatibility if you still want old total changes.
        totalChangeCount: orbit.current.manualChangeCount + orbit.current.passiveChangeCount,

        manualAzimuthCoverage: orbit.current.manualAzBins.size,
        manualElevationCoverage: orbit.current.manualElBins.size,

        passiveAzimuthCoverage: orbit.current.passiveAzBins.size,
        passiveElevationCoverage: orbit.current.passiveElBins.size,

        viewedMultipleAngles,
        passiveViewedMultipleAngles,
        fullRotationCompleted,

        resets: orbit.current.resets,
        fits: orbit.current.fits,
      },
      zoom: {
        // Number of meaningful user-driven camera distance changes.
        zoomChangeCount: zoomRef.current.zoomChangeCount,

        // Closest camera distance reached.
        minCameraDistance: zoomRef.current.minCameraDistance,

        // Farthest camera distance reached.
        maxCameraDistance: zoomRef.current.maxCameraDistance,

        // Whether user zoomed meaningfully closer than the initial view.
        deepZoomUsed,
      },
      camera: {
        // Camera state when the tracker attached to controls.
        initial: initialCameraStateRef.current,

        // Camera state when the answer was submitted.
        final: finalCameraState,
      },
      model: {
        // Existing hover duration by raw mesh name.
        meshHoverMs: hoverDur.current,

        // Existing simple click counts by raw mesh name.
        meshClicks: meshClicks.current,

        // Total successful model-surface clicks.
        modelClickCount: surfaceClickSamplesRef.current.length,

        // Total clicks/taps inside the viewer that missed the 3D model.
        emptySpaceClickCount: emptySpaceClickCountRef.current,

        // Total viewer clicks/taps, including model hits and empty-space misses.
        viewerClickCount: surfaceClickSamplesRef.current.length + emptySpaceClickCountRef.current,

        // Unique raw mesh names clicked.
        clickedMeshNames,

        // Unique raw material names clicked.
        clickedMaterialNames,

        // Exact model-surface click samples for future heatmaps.
        surfaceClickSamples: surfaceClickSamplesRef.current,

        // Empty click samples for later viewer-friction analysis.
        emptySpaceClickSamples: emptySpaceClickSamplesRef.current,

        // Generic 3x3 click heatmap summary for creator analytics.
        screenZoneClickSummary: screenZoneClickSummaryRef.current,

        answeredWithout3DInteraction,
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
    recordSurfaceClick,
    recordEmptySpaceClick,
  };
}
