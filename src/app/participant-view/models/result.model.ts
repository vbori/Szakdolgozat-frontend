export interface Position{
  x: number;
  y: number;
}

export interface Click{
  timestamp: number;
  position: Position;
  misclick: boolean;
  distracted: boolean;
}

export interface Result {
  experimentId: string;
  participantId: string;
  roundIdx?: number;
  roundId?: string;
  cursorPositions?: Position[];
  clicks: Click[];
  misclickCount: number;
  timeNeeded: number;
  cursorPathLength?: number;
};
