export interface Form {
  questions: IQuestion[];
}

interface Validation {
  min: number;
  max: number;
}

export interface Option {
  optionLabel: string;
}

export interface IQuestion {
  questionId: string;
  label: string;
  type: QuestionType;
  options?: Option[];
  validation?: Validation;
  required: boolean;
}

export class Question implements IQuestion {
  questionId: string;
  label: string;
  type: QuestionType;
  options?: Option[];
  validation?: Validation;
  required: boolean;

  constructor(questionId: string, label: string, type: QuestionType = 'text', options: Option[] | undefined = undefined, validation: Validation | undefined = undefined, required: boolean = true) {
    this.questionId = questionId;
    this.label = label;
    this.type = type;
    this.options = options;
    this.validation = validation;
    this.required = required;
  }
}

export type QuestionType = 'text' | 'number' | 'radio' | 'checkbox' | 'select';
