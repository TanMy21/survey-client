import type { ParticipantMeta } from "@/types/sessionTypes";

export function buildParticipantMeta(): ParticipantMeta {
  const ua = navigator.userAgent || "";
  const lang = navigator.language;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const w = window.screen?.width ?? 0;
  const h = window.screen?.height ?? 0;
  const dpr = window.devicePixelRatio || 1;
  const colorDepth = window.screen?.colorDepth ?? 24;

  // device type heuristic
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const deviceType: "mobile" | "tablet" | "desktop" = isTablet
    ? "tablet"
    : isMobile
      ? "mobile"
      : "desktop";

  const browser = /Chrome|Firefox|Safari|Edge|Edg|Opera|OPR/i.exec(ua)?.[0] ?? undefined;
  const os = /Windows|Mac OS X|Android|iPhone OS|iPad OS|Linux/i.exec(ua)?.[0] ?? undefined;

  return {
    language: lang,
    languages: navigator.languages as string[] | undefined,
    timezone: tz,
    userAgent: ua,
    deviceType,
    browser,
    os,
    screen: { w, h, dpr, colorDepth },
  };
}
