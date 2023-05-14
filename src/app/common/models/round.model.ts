import { Flashing, IShape } from "./shape.model";

export interface BackgroundDistraction {
  color: string;
  duration: number;
  flashing?: Flashing;
}

export interface IRound {
  roundIdx?: number;
  _id?: string;
  objects: IShape[];
  canvasHeight: number;
  canvasWidth: number;
  background: string;
  shapeDistractionDuration?: number;
  backgroundDistraction?: BackgroundDistraction;
}

export class Round implements IRound{
  roundIdx?: number = undefined;
  _id?: string = undefined;
  objects: IShape[] = [];
  canvasHeight = 600;
  canvasWidth = 600;
  background = '#ffffff';
  shapeDistractionDuration?: number = undefined;
  backgroundDistraction?: BackgroundDistraction = undefined;

  constructor();
  constructor(round: IRound);
  constructor(round?: IRound) {
    if (round) {
      Object.assign(this, round);
      this.objects = round.objects.map(object => ({ ...object }));
      this._id = undefined;
      this.backgroundDistraction = round.backgroundDistraction ? { ...round.backgroundDistraction } : undefined;
      if(this.backgroundDistraction)
      this.backgroundDistraction.flashing = round.backgroundDistraction?.flashing ? { ...round.backgroundDistraction?.flashing } : undefined;
    }
  }
}
