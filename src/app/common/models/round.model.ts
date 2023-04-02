interface Flashing {
  flashColor: string;
  flashFrequency: number;
}

interface Point {
  x: number;
  y: number;
}

interface Shape {
  shapeType: string;
  isFilled: boolean;
  shapeColor: string;
  flashing?: Flashing;
  shapeWidth: number;
  shapeHeight: number;
  position: Point;
  isTarget: boolean;
}

interface BackGroundDistraction {
  backGroundDistractionColor: string;
  startTime: number;
  duration: number;
  flashing?: Flashing;
}

interface ShapeDistraction {
  distractingShapes:  [Shape];
  startTime: number;
  duration: number;
}

export interface Round {
  roundIdx: number;
  isPractice: boolean;
  restTime: number;
  shapes: [Shape];
  useBackGroundDistraction: boolean;
  useShapeDistraction: boolean;
  backGroundDistraction?: BackGroundDistraction;
  shapeDistractions?: [ShapeDistraction];
}
