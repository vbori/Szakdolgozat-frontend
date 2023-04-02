export interface Form {
  questions: [Question];
}

interface Validation {
  min: Number;
  max: Number;
}

interface Question {
  questionId: String;
  label: String;
  type: String;
  options?: [String];
  validation: Validation;
  required: Boolean;
}
