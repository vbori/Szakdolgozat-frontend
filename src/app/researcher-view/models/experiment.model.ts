export interface Experiment {
  name: string;
  researcherDescription: string;
}

export interface ExperimentExtract extends Experiment {
  _id: string;
  status: ExperimentStatus;
  participantNum: number;
}

export type ExperimentStatus = 'Active' | 'Draft' | 'Closed';
