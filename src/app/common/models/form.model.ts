export interface Form {
  questions: Question[];
}

interface Validation {
  min: number;
  max: number;
}

export interface Option {
  optionLabel: string;
}

export interface Question {
  questionId: string;
  label: string;
  type: QuestionType;
  options?: Option[];
  validation?: Validation;
  required: boolean;
}

export class QuestionClass implements Question {
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

type QuestionType = 'text' | 'number' | 'radio' | 'checkbox' | 'select';
