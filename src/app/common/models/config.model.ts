interface BackGroundDistractionConfig {
    backGroundDistractionColor: string;
    minDistractionDurationTime: number;
    maxDistractionDurationTime: number;
}

interface DistractingShapeConfig {
    distractingShapeMinWidth: number;
    distractingShapeMaxWidth: number;
    distractingShapeMinHeight: number;
    distractingShapeMaxHeight: number;
    distractingShapeTypes: string[];
    distractingShapeColors: string[];
    minDistractionDurationTime: number;
    maxDistractionDurationTime: number;
}

export interface Configuration {
    setNum: number;
    roundNum: number;
    practiceRoundNum: number;
    restTime: number;
    backgroundColors: string[];
    shapeColors: string[];
    distractedRoundNum: number;
    changePosition: boolean;
    minDistance: number;
    baseShapeType: ShapeType[];
    targetShapeType: ShapeType[];
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    backGroundDistractionConfig?: BackGroundDistractionConfig;
    distractingShapeConfig?: DistractingShapeConfig;
}

export type ShapeType = 'Circle' | 'Square' | 'Rectangle';
