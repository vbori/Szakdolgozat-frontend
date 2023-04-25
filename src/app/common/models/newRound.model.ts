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

export interface NewShape{
  target: boolean;
  distraction: boolean;
  flashing?: Flashing;
  baseColor?: string;
  type: string;  //TODO: try to refactor to ShapeType
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
  type: string; //TODO: try to refactor to ShapeType
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

export interface BackgroundDistraction {
  color: string;
  duration: number;
  flashing?: Flashing;
}

export interface NewRound {
  roundIdx?: number;
  _id?: string;
  objects: NewShape[];
  canvasHeight: number;
  canvasWidth: number;
  background: string;
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackgroundDistraction;
}

export class NewRoundClass implements NewRound{
  roundIdx?: number;
  _id?: string;
  objects: NewShape[];
  canvasHeight: number;
  canvasWidth: number;
  background: string;
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackgroundDistraction;

  constructor(objects: NewShape[] =  [], canvasHeight: number = 500, canvasWidth: number = 500, background: string = '#fff'){
    this.objects = objects;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.background = background;
  }
}

type ShapeType = 'rect' | 'circle'
