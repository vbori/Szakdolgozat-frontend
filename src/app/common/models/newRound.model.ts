export interface FabricShape extends fabric.Object {
  target?: boolean;
  flashing?: Flashing;
  baseColor?: string;
}

interface Flashing{
  color: string;
  frequency: number;
}

export interface NewShape{
  target: boolean;
  distraction: boolean;
  flashing?: Flashing;
  baseColor?: string;
  type: ShapeType;
  radius?: number;
  originX: string;
  originY: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill: string;
}

interface BackGroundDistraction {
  color: string;
  duration: number;
  flashing?: Flashing;
}

export interface NewRound {
  roundIdx?: number;
  roundId?: string;
  isPractice?: boolean;
  restTimeSec?: number;
  objects: NewShape[];
  canvasHeight: number;
  canvasWidth: number;
  background: string;
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackGroundDistraction;
}

type ShapeType = 'rect' | 'circle'
