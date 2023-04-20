export interface FabricShape extends fabric.Object {
  target: boolean;
  flashing?: Flashing;
  baseColor?: string;
}

interface Flashing{
  color: string;
  frequency: number;
}

export interface NewShape{
  target: boolean;
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

export interface NewRound {
  roundIdx?: number;
  isPractice?: boolean;
  restTimeSec?: number;
  objects: NewShape[];
  backgroundFlashing?: Flashing;
  canvasHeight: number;
  canvasWidth: number;
  background: string;
}

type ShapeType = 'rect' | 'circle'
