export interface EmailContactFormInput {
  emailContact: string;
}

export interface FormData {
  choice: string;
}

export interface TextFormInput {
  text: string;
}
export interface NumberFormInput {
  number: number;
}

export interface OptionType {
  qID?: string;
  optionID: string;
  relatedQuestionID: string;
  creatorId: string;
  text: string;
  qType: string;
  value: string;
  image: string;
  order: number;
}
