import { ExperimentConfiguration } from "../../researcher-view/models/config.model";
import { IRound } from "./round.model";

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
  rounds: IRound[];
  experimentConfiguration?: ExperimentConfiguration;
}

export type ExperimentStatus = 'Active' | 'Draft' | 'Closed';
