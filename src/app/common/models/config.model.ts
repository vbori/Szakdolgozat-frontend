import { Flashing } from "./round.model";

interface BackgroundDistractionConfig {
    backgroundDistractionColor: string;
    minDistractionDurationTime: number;
    maxDistractionDurationTime: number;
    flashing?: Flashing;
}

interface DistractingShapeConfig {
    distractingShapeMinWidth: number;
    distractingShapeMaxWidth: number;
    distractingShapeMinHeight: number;
    distractingShapeMaxHeight: number;
    distractingShapeTypes: string[];
    distractingShapeColor: string;
    minDistractionDurationTime: number;
    maxDistractionDurationTime: number;
    flashing?: Flashing;
}

export interface Configuration {
    setNum: number;
    roundNum: number;
    backgroundColor: string;
    targetShapeColor: string;
    baseShapeColor: string;
    distractedRoundNum: number;
    changePosition: boolean;
    changeShapeSize: boolean;
    twoDimensional: boolean;
    canvasHeight: number;
    canvasWidth: number;
    baseShapeType: ShapeType[];
    targetShapeType: ShapeType[];
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    backgroundDistractionConfig?: BackgroundDistractionConfig;
    distractingShapeConfig?: DistractingShapeConfig;
}

export type ShapeType = 'Circle' | 'Square' | 'Rectangle';
