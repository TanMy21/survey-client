import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { setupThreeMeshBVH } from "./lib/threeMeshBvh.ts";

// Initialize the BVH library for optimized 3D interactions
setupThreeMeshBVH();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
