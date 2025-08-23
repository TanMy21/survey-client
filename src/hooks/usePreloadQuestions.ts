import type { Question3Dish } from "@/types/questionTypes";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";

export function warmGLTF(url?: string | null) {
  if (!url) return;
  const lower = url.toLowerCase();
  if (lower.endsWith(".glb") || lower.endsWith(".gltf")) {
    try {
      (useGLTF as any).preload?.(url);
    } catch {
      // ignore errors, preload is best-effort
    }
  }
}

/** Collect neighbor URLs around currentIndex (±windowSize) */
export function getNeighbor3DUrls<T extends Question3Dish>(
  questions: T[],
  currentIndex: number,
  windowSize = 1
): string[] {
  if (!Array.isArray(questions) || questions.length === 0) return [];
  const urls = new Set<string>();

  for (let offset = 1; offset <= windowSize; offset++) {
    const next = questions[currentIndex + offset];
    const prev = questions[currentIndex - offset];
    if (next?.Model3D?.fileUrl) urls.add(next.Model3D.fileUrl);
    if (prev?.Model3D?.fileUrl) urls.add(prev.Model3D.fileUrl);
  }
  return [...urls];
}

/** Preload a list of GLTF/GLB URLs using drei's cache */
export function usePreloadGLTF(urls: string[]) {
  // Make dependency stable across same content / different references
  const key = useMemo(() => urls.filter(Boolean).join("|"), [urls]);

  useEffect(() => {
    if (!key) return;
    for (const u of urls) {
      if (!u) continue;
      const lower = u.toLowerCase();
      if (lower.endsWith(".glb") || lower.endsWith(".gltf")) {
        try {
          (useGLTF as any).preload?.(u);
        } catch {
          // ignore; preload is best-effort
        }
      }
    }
  }, [key, urls]);
}

/** Convenience hook: preload neighbors around an index in a questions array */
export function usePreloadNeighbors<T extends Question3Dish>(
  questions: T[],
  currentIndex: number,
  windowSize = 1
) {
  const urls = useMemo(
    () => getNeighbor3DUrls(questions, currentIndex, windowSize),
    [questions, currentIndex, windowSize]
  );
  usePreloadGLTF(urls);
}
