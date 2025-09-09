export const useHaptics = () => {
  const vibrate = (pattern: number | number[] = 12) => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        // @ts-ignore
        navigator.vibrate?.(pattern);
      }
    } catch {}
  };
  return { vibrate };
};
