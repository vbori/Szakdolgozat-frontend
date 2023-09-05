import { Flashing } from "src/app/common/models/shape.model";

interface BackgroundDistractionConfig {
  color: string;
  minDuration: number;
  maxDuration: number;
  flashing?: Flashing;
}

interface DistractingShapeConfig {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  distractingShapeTypes: ConfigShapeType[];
  color: string;
  minDuration: number;
  maxDuration: number;
  flashing?: Flashing;
}

export interface ExperimentConfiguration {
  setNum: number;
  roundNum: number;
  breakTime?: number;
  backgroundColor: string;
  targetShapeColor: string;
  baseShapeColor: string;
  distractedRoundNum: number;
  changePosition: boolean;
  changeShapeSize: boolean;
  oneDimensional: boolean;
  canvasHeight: number;
  canvasWidth: number;
  baseShapeTypes: ConfigShapeType[];
  targetShapeTypes: ConfigShapeType[];
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  backgroundDistractionConfig?: BackgroundDistractionConfig;
  distractingShapeConfig?: DistractingShapeConfig;
}

export type ConfigShapeType = 'circle' | 'square' | 'rect';
