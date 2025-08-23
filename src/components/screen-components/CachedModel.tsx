import { useIsMobile } from "@/hooks/useIsMobile";
import type { CachedModelProps } from "@/types/questionTypes";
import { Bounds, Html, useBounds, useGLTF } from "@react-three/drei";
import { Focus } from "lucide-react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

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
