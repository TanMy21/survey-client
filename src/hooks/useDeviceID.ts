import { getOrCreateDeviceId } from "@/utils/deviceID";
import { useState } from "react";

export function useDeviceId() {
  const [deviceId] = useState(() => {
    try {
      return getOrCreateDeviceId();
    } catch {
      return "";
    }
  });

  return deviceId;
}