export interface FabricShape extends fabric.Object {
  target?: boolean;
  flashing?: Flashing;
  baseColor?: string;
  distraction?: boolean;
  radius?: number;
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

export class NewShapeModel implements NewShape{
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

  constructor(shape: NewShape){
    this.target = shape.target;
    this.distraction = shape.distraction;
    this.flashing = shape.flashing;
    this.baseColor = shape.baseColor;
    this.type = shape.type;
    this.radius = shape.radius;
    this.originX = shape.originX;
    this.originY = shape.originY;
    this.left = shape.left;
    this.top = shape.top;
    this.width = shape.width;
    this.height = shape.height;
    this.fill = shape.fill;
  }
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
