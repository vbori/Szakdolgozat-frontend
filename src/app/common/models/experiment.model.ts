import { Configuration } from "./config.model";
import { Round } from "./round.model";

export interface ExperimentExtract{
  _id: string;
  name: string;
  researcherDescription: string;
  status: ExperimentStatus;
  participantNum: number;
}

export interface Experiment extends ExperimentExtract {
  formId?: string;
  type: string;
  openedAt?: Date;
  closedAt?: Date;
  maxParticipantNum: number;
  controlGroupChance: number;
  trajectoryImageNeeded: boolean;
  positionArrayNeeded: boolean;
  participantDescription: string;
  rounds: Round[];
  experimentConfiguration?: Configuration;
}

export type ExperimentStatus = 'Active' | 'Draft' | 'Closed';
