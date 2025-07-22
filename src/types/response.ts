export interface ResponseData {
  surveyID?: string;
  questionID: string;
  qType: string | null;
  optionID: string | null;
  response: string | number | number[] | null;
  participantID?: string | null;
}


