export type SurveyReportReason =
  | "SPAM"
  | "SCAM_OR_PHISHING"
  | "ABUSE_OR_HARASSMENT"
  | "INAPPROPRIATE_CONTENT"
  | "MISLEADING_CONTENT"
  | "PRIVACY_CONCERN"
  | "OTHER";

export type ReportSurveyArgs = {
  shareID: string;
  reason: SurveyReportReason;
  description?: string;
  screenshot?: File | null;
};

export type ReportSurveyResponse = {
  success: boolean;
  message: string;
};


export type ReportSurveyModalProps = {
  open: boolean;
  shareID: string;
  onClose: () => void;
};

export type ReasonOption = {
  value: SurveyReportReason;
  label: string;
};