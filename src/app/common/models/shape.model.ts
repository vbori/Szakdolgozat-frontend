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

export interface IShape{
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

export class Shape implements IShape{
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

  constructor(shape: IShape){
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

export type ShapeType = 'rect' | 'circle'
