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
  strokeWidth: number;
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
  strokeWidth: number;

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
    this.strokeWidth = 0;
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
  /*roundIdx?: number;
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
  }*/

  roundIdx?: number;
  _id?: string;
  objects: NewShape[] = [];
  canvasHeight = 0;
  canvasWidth = 0;
  background = '';
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackgroundDistraction;

  constructor();
  constructor(round: NewRound);
  constructor(round?: NewRound) {
    if (round) {
      Object.assign(this, round);
      this.objects = round.objects.map(object => ({ ...object }));
    }
  }
}

type ShapeType = 'rect' | 'circle'
