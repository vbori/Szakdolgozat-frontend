export interface FabricShape extends fabric.Object {
  target?: boolean;
  flashing?: Flashing;
  baseColor?: string;
  distraction?: boolean;
  radius?: number;
}

export interface Flashing{
  color: string;
  frequency: number;
}

export interface Shape{
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
  strokeWidth: number;
}

export class ShapeModel implements Shape{
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
  strokeWidth: number;

  constructor(shape: Shape){
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
    this.strokeWidth = 0;
  }
}

export interface BackgroundDistraction {
  color: string;
  duration: number;
  flashing?: Flashing;
}

export interface Round {
  roundIdx?: number;
  _id?: string;
  objects: Shape[];
  canvasHeight: number;
  canvasWidth: number;
  background: string;
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackgroundDistraction;
}

export class RoundClass implements Round{
  roundIdx?: number;
  _id?: string;
  objects: Shape[] = [];
  canvasHeight = 0;
  canvasWidth = 0;
  background = '';
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackgroundDistraction;

  constructor();
  constructor(round: Round);
  constructor(round?: Round) {
    if (round) {
      Object.assign(this, round);
      this.objects = round.objects.map(object => ({ ...object }));
    }
  }
}

 export type ShapeType = 'rect' | 'circle'
