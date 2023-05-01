import { ConfigShapeType, ExperimentConfiguration } from "src/app/common/models/config.model";
import { BackgroundDistraction, Round, Shape, ShapeType } from "src/app/common/models/round.model";

export function createInitialShape(canvasHeight: number, types: ConfigShapeType[], minWidth: number, maxWidth: number, minHeight: number, maxHeight: number, color: string, target: boolean, distraction: boolean): Shape{
  let chosenType: ConfigShapeType = types[Math.floor(Math.random() * types.length)];
  let width, height: number = 0;
  let radius: number | undefined = undefined;
  let type: ShapeType
  let sameSize: boolean;
  switch(chosenType){
    case 'circle':
      width = minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1));
      radius = width / 2.0;
      type = 'circle';
      sameSize = true;
      break;
    case 'square':
      width = minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1));
      type = 'rect';
      sameSize = true;
      break;
    case 'rect':
      width = minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1));
      height = minHeight + Math.floor(Math.random() * (maxHeight - minHeight + 1));
      type = 'rect';
      sameSize = false;
      break;
  }
  let top = sameSize ? Math.floor(Math.random() * (canvasHeight - width)) : Math.floor(Math.random() * (canvasHeight - height));
  let shape: Shape = {
    width: width,
    height: sameSize ? width : height,
    radius: radius,
    type: type,
    baseColor: color,
    fill: color,
    left: 0,
    top: top,
    target: target,
    distraction: distraction,
    originX: 'left',
    originY: 'top',
    strokeWidth: 0,
  }
  return shape;
}

export function chooseDistractedRoundIndexes(numRounds: number, distractedRoundsPerSet: number): number[] {
  // Create an array of all round indexes in the set
  const roundIndexes = Array.from({ length: numRounds }, (_, i) => i);

  // Shuffle the array randomly
  for (let i = roundIndexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roundIndexes[i], roundIndexes[j]] = [roundIndexes[j], roundIndexes[i]];
  }

  // Choose the first distractedRoundsPerSet number of indexes as the distracted rounds
  const distractedRoundIndexes = roundIndexes.slice(0, distractedRoundsPerSet);

  return distractedRoundIndexes;
}

export function calculateMaxLimits(canvasSize: number, normalMinSize: number, normalMaxSize: number, distractionMinSize: number | undefined, distractionMaxSize: number | undefined): { normalMaxLimit: number, distractionMaxLimit: number | undefined } {
  let normalMaxLimit : number = normalMaxSize * 2 <= canvasSize ? normalMaxSize : canvasSize / 2;
  let distractionMaxLimit: number  | undefined = undefined;
  if(distractionMinSize && distractionMaxSize){
    distractionMaxLimit = distractionMaxSize;
    if(distractionMaxLimit + 2* normalMaxLimit > canvasSize){
      let dividedFreeSpace = Math.floor((canvasSize - distractionMinSize - 2* normalMinSize) / 3);
      normalMaxLimit = Math.min(normalMinSize + dividedFreeSpace, normalMaxLimit);
      distractionMaxLimit = Math.min(distractionMinSize + dividedFreeSpace, distractionMaxLimit);
    }
  } 

  return { normalMaxLimit, distractionMaxLimit };
}

export function createRound(roundIdx: number, config: ExperimentConfiguration, baseShape: Shape, targetShape: Shape, distractionMode: number, maxWidth: number | undefined, maxHeight: number, normalMaxLimit: number): Round{
  let distractingShape: Shape | undefined = undefined;
  let shapeDistractionDuration: number | undefined = undefined;
  let backgroundDistraction : BackgroundDistraction | undefined = undefined;

  if(config.distractingShapeConfig && (distractionMode > 1) && maxWidth){
    distractingShape = createInitialShape(config.canvasHeight ,config.distractingShapeConfig.distractingShapeTypes, config.distractingShapeConfig.minWidth, maxWidth, config.distractingShapeConfig.minHeight, maxHeight, config.distractingShapeConfig.color, false, true);
    distractingShape.left = normalMaxLimit + Math.floor(Math.random() * (maxWidth - distractingShape.width));
    if(config.distractingShapeConfig.flashing){
      distractingShape.flashing = {color: config.distractingShapeConfig.flashing?.color, frequency: config.distractingShapeConfig.flashing?.frequency};
    }
    shapeDistractionDuration = Math.floor(Math.random() * (config.distractingShapeConfig.maxDuration - config.distractingShapeConfig.minDuration)) + config.distractingShapeConfig.minDuration;
  }

  if(distractionMode % 2 == 1 && config.backgroundDistractionConfig){
    backgroundDistraction = {
      color: config.backgroundDistractionConfig?.color,
      duration: Math.floor(Math.random() * (config.backgroundDistractionConfig?.maxDuration - config.backgroundDistractionConfig?.minDuration)) + config.backgroundDistractionConfig?.minDuration,
      flashing: config.backgroundDistractionConfig?.flashing ? {
        color: config.backgroundDistractionConfig?.flashing?.color,
        frequency: config.backgroundDistractionConfig?.flashing?.frequency
      } : undefined
    }
  }

  let round: Round = {
    roundIdx: roundIdx,
    objects: distractingShape ? [baseShape, distractingShape, targetShape] : [baseShape, targetShape],
    background: config.backgroundColor,
    canvasWidth: config.canvasWidth,
    canvasHeight: config.canvasHeight,
    shapeDistractionDuration: shapeDistractionDuration,
    backgroundDistraction: backgroundDistraction
  }
  return round;
}