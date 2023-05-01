import { ExperimentConfiguration } from "./config.model";
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
  openedAt?: string;
  closedAt?: string;
  maxParticipantNum: number;
  controlGroupChance: number;
  cursorImageMode?: string;
  positionTrackingFrequency?: number;
  participantDescription: string;
  rounds: Round[];
  experimentConfiguration?: ExperimentConfiguration;
}

export type ExperimentStatus = 'Active' | 'Draft' | 'Closed';
