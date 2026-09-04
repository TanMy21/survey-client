import { useState } from "react";

export const useIsMobileDevice = () => {
  const [isMobileDevice] = useState(() => {
    if (typeof navigator === "undefined") return false;

    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent);

    const isIPadOS = /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;

    return mobileUserAgent || isIPadOS;
  });

  return isMobileDevice;
};
