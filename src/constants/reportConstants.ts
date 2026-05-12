import type { ReasonOption } from "@/types/reportSurveyTypes";

export const REASON_OPTIONS: ReasonOption[] = [
  { value: "SPAM", label: "Spam" },
  { value: "SCAM_OR_PHISHING", label: "Scam or phishing" },
  { value: "ABUSE_OR_HARASSMENT", label: "Abuse or harassment" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "MISLEADING_CONTENT", label: "Misleading content" },
  { value: "PRIVACY_CONCERN", label: "Privacy concern" },
  { value: "OTHER", label: "Other" },
];

export const MAX_DESCRIPTION_LENGTH = 1500;
export const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;