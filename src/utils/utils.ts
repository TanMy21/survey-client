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

export function htmlToPlainText(html?: string | null): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;

  const text = div.textContent || "";
  return text.replace(/\u00A0/g, " ");
}