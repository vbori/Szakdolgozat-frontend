export interface Form {
  questions: [Question];
}

interface Validation {
  min: number;
  max: number;
}

export interface Question {
  questionId: string;
  label: string;
  type: string;
  options?: [string];
  validation?: Validation;
  required: boolean;
}
