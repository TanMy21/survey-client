import * as THREE from "three";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
import "three-mesh-bvh";

// Initializes BVH methods globally.
export function setupThreeMeshBVH() {
  // Cast avoids mismatched MeshBVH/GeometryBVH return types between package versions.
  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree as any;

  // Cast avoids prototype assignment type mismatch in some Three.js/type combinations.
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree as any;

  // Cast avoids raycast signature mismatch in some Three.js/type combinations.
  THREE.Mesh.prototype.raycast = acceleratedRaycast as any;
}
