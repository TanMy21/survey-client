import { DEFAULT_IAT_TIME_LIMIT_MS } from "@/constants/screenConstants";
import type { IATGroup, IATRoundType, IATSide } from "@/types/questionTypes";

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
    order: -2, // Comment: order not relied upon anymore
  } as any;

  // Comment: Find welcome and insert right after it by index
  const i = list.findIndex((q) => q.type === "WELCOME_SCREEN");
  if (i >= 0) {
    const next = [...list.slice(0, i + 1), consentNode, ...list.slice(i + 1)];
    return next;
  }

  // Comment: If no welcome, prepend consent to guarantee first render
  return [consentNode, ...list];
}

export const getTimedChoiceOptionImage = (
  question: any,
  side: "left" | "right"
): { imageUrl?: string; altText?: string | null } | undefined => {
  const images = question?.questionImages || [];

  const role = side === "left" ? "TIMED_CHOICE_LEFT" : "TIMED_CHOICE_RIGHT";

  return images.find((image: any) => image.role === role) || images[side === "left" ? 0 : 1];
};

export const getConceptFitImage = (
  question: any
): { questionImageID?: string; imageUrl?: string; altText?: string | null } => {
  const images = question?.questionImages || [];

  return images.find((image: any) => image.role === "CONCEPT_FIT_STIMULUS") || images[0];
};

export const getParticipantIATUiConfig = (rawUiConfig: any = {}) => {
  return {
    ...rawUiConfig,

    timeLimitMs:
      typeof rawUiConfig.timeLimitMs === "number"
        ? rawUiConfig.timeLimitMs
        : DEFAULT_IAT_TIME_LIMIT_MS,

    iatLeftKey: rawUiConfig.iatLeftKey || "E",
    iatRightKey: rawUiConfig.iatRightKey || "I",

    iatBrandA: {
      label: rawUiConfig.iatBrandA?.label || rawUiConfig.iatLeftCategoryLabel || "Brand A",
    },

    iatBrandB: {
      label: rawUiConfig.iatBrandB?.label || rawUiConfig.iatRightCategoryLabel || "Brand B",
    },

    iatThemeA: {
      label: rawUiConfig.iatThemeA?.label || "Positive",
    },

    iatThemeB: {
      label: rawUiConfig.iatThemeB?.label || "Negative",
    },

    allowSkip: Boolean(rawUiConfig.allowSkip),
    iatAllowSkip: Boolean(rawUiConfig.iatAllowSkip),
  };
};

export const getIATOptionGroup = (settings: any): IATGroup | null => {
  if (!settings) return null;

  let parsedSettings = settings;

  if (typeof settings === "string") {
    try {
      parsedSettings = JSON.parse(settings);
    } catch {
      return null;
    }
  }

  const group =
    parsedSettings.iatGroup ||
    parsedSettings.group ||
    parsedSettings.categoryGroup ||
    parsedSettings.iatOptionGroup;

  if (group === "THEME_A" || group === "THEME_B") {
    return group;
  }

  return null;
};

export const getIATRoundTargets = (
  round: IATRoundType,
  uiConfig: ReturnType<typeof getParticipantIATUiConfig>,
) => {
  if (round === "REVERSED") {
    return {
      left: {
        brand: uiConfig.iatBrandB.label,
        theme: uiConfig.iatThemeA.label,
      },
      right: {
        brand: uiConfig.iatBrandA.label,
        theme: uiConfig.iatThemeB.label,
      },
    };
  }

  return {
    left: {
      brand: uiConfig.iatBrandA.label,
      theme: uiConfig.iatThemeA.label,
    },
    right: {
      brand: uiConfig.iatBrandB.label,
      theme: uiConfig.iatThemeB.label,
    },
  };
};

export const getExpectedSideForIATStimulus = (
  group: IATGroup,
  _round: IATRoundType,
): IATSide => {
  return group === "THEME_A" ? "left" : "right";
};