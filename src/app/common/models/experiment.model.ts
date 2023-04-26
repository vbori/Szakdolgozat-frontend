import { Configuration } from "./config.model";
import { NewRound } from "./newRound.model";

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
  openedAt?: string;
  closedAt?: string;
  maxParticipantNum: number;
  controlGroupChance: number;
  cursorImageMode?: string;
  positionTrackingFrequency?: number;
  participantDescription: string;
  rounds: NewRound[];
  experimentConfiguration?: Configuration;
}

export type ExperimentStatus = 'Active' | 'Draft' | 'Closed';
