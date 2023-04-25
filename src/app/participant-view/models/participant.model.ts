export interface Response {
  questionId: string;
  response: number | boolean | string | string[];
};

export interface Participant {
  _id: string;
  experimentId: string;
  responses: Response[];
  inControlGroup: boolean;
};
