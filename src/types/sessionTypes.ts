export interface Session {
  participantID: string;
  completed: boolean;
  completedAt: string;
}

export interface SessionArgs{
  surveyID: string;
  participantID: string;
}