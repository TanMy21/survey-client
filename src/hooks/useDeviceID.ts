import { LS_DID_KEY } from "@/utils/deviceID";
import { useEffect, useState } from "react";

 

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_DID_KEY);
      if (stored) {
        setDeviceId(stored);
      } else {
        const newId = crypto.randomUUID();
        localStorage.setItem(LS_DID_KEY, newId);
        setDeviceId(newId);
      }
    } catch {     
      setDeviceId("");
    }
  }, []);

  return deviceId;
}
