export interface Response {
  questionId: string;
  response: any
};

export interface Participant {
  _id: string;
  experimentId: string;
  responses: Response[];
  inControlGroup: boolean;
};
