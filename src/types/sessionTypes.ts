export interface Session {
  sessionID: string;
  participantID: string;
  relatedSurveyID: string;
  relatedParticipantID: string;
  sessionState: "ACTIVE" | "PAUSED" | "COMPLETED";
  startedAt: string;
  completedAt: string;
}

export type ParticipantMeta = {
  language?: string;
  languages?: string[];
  timezone?: string;
  userAgent?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
  browser?: string;
  os?: string;
  screen?: { w: number; h: number; dpr: number; colorDepth: number };
};

export interface SessionArgs {
  surveyID?: string;
  shareID: string;
  deviceID: string;
  meta?: ParticipantMeta;
  participantID?: string;
}

export interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
}


export interface PauseSessionArgs {
  surveyID: string;
  deviceID: string;
}