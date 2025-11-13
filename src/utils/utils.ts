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


export function injectConsentAfterWelcome(questions: any[]): any[] {
  // Comment: Clone to avoid mutating 'data.questions'
  const list = [...(questions ?? [])];

  // Comment: Build the consent node once
  const consentNode = {
    questionID: "consent-screen", // Comment: deterministic ID for mapping
    type: "CONSENT",
    order: undefined, // Comment: order not relied upon anymore
  } as any;

  // Comment: Find welcome and insert right after it by index
  const i = list.findIndex(q => q.type === "WELCOME_SCREEN");
  if (i >= 0) {
    const next = [...list.slice(0, i + 1), consentNode, ...list.slice(i + 1)];
    return next;
  }

  // Comment: If no welcome, prepend consent to guarantee first render
  return [consentNode, ...list];
}