import { ConfigShapeType, ExperimentConfiguration } from "src/app/researcher-view/models/config.model";
import { BackgroundDistraction, IRound } from "src/app/common/models/round.model";
import { IShape, ShapeType } from "src/app/common/models/shape.model";

export function createInitialShape(canvasHeight: number, types: ConfigShapeType[], minWidth: number, maxWidth: number, minHeight: number, maxHeight: number, color: string, target: boolean, distraction: boolean): IShape{
  let chosenType: ConfigShapeType;

  if(canvasHeight < minWidth){ //This is only possible if rect is between the shape options, otherwise the form would have been invalid
    chosenType = 'rect';
  }else{
    chosenType = types[Math.floor(Math.random() * types.length)];
  }

  let width = minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1)); //choose a random width between the min and max
  let height: number = 0;
  let radius: number | undefined = undefined;
  let type: ShapeType //unlike chosenType, this can't be a square
  let sameSize: boolean; //whether the width and height are the same

  switch(chosenType){
    case 'circle':
      radius = width / 2.0;
      type = 'circle';
      sameSize = true;
      break;
    case 'square':
      type = 'rect';
      sameSize = true;
      break;
    case 'rect':
      height = minHeight + Math.floor(Math.random() * (maxHeight - minHeight + 1));
      type = 'rect';
      sameSize = false;
      break;
  }

  let top = Math.floor(Math.random() * (canvasHeight - (sameSize ? width : height))); //choose a random top position between 0 and the last possible position
  let shape: IShape = {
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

export function calculateMaxSpace(canvasSize: number, normalMinSize: number, distractionMinSize: number | undefined): { normalMaxSpace: number, distractionMaxSpace: number | undefined } {
  let normalMaxSpace  = canvasSize / 2;
  let distractionMaxSpace: number  | undefined = undefined;
  if(distractionMinSize){
    if(canvasSize - distractionMinSize - 2* normalMinSize > 0){ //If there is extra space, divide it evenly between the shapes
      let dividedFreeSpace = Math.floor((canvasSize - distractionMinSize - 2* normalMinSize) / 3);
      normalMaxSpace = normalMinSize + dividedFreeSpace;
      distractionMaxSpace = distractionMinSize + dividedFreeSpace;
    }else{
      normalMaxSpace = normalMinSize;
      distractionMaxSpace = distractionMinSize;
    }
  }

  return { normalMaxSpace, distractionMaxSpace };
}

export function createRound(roundIdx: number, config: ExperimentConfiguration, baseShape: IShape, targetShape: IShape, distractionMode: number, distractionMaxSpace: number | undefined, maxHeight: number, normalMaxLimit: number): IRound{
  let distractingShape: IShape | undefined = undefined;
  let shapeDistractionDuration: number | undefined = undefined;
  let backgroundDistraction : BackgroundDistraction | undefined = undefined;

  if(config.distractingShapeConfig && (distractionMode > 1) && distractionMaxSpace){ //Create shape distraction
    distractingShape = createInitialShape(config.canvasHeight ,config.distractingShapeConfig.distractingShapeTypes, config.distractingShapeConfig.minWidth, Math.min(distractionMaxSpace, config.distractingShapeConfig.maxWidth), config.distractingShapeConfig.minHeight, maxHeight, config.distractingShapeConfig.color, false, true);
    distractingShape.left = normalMaxLimit + Math.floor(Math.random() * (distractionMaxSpace - distractingShape.width));
    distractingShape.top = Math.min(Math.floor((baseShape.top + targetShape.top)/2), config.canvasHeight - distractingShape.height);
    if(config.distractingShapeConfig.flashing){
      distractingShape.flashing = {color: config.distractingShapeConfig.flashing?.color, frequency: config.distractingShapeConfig.flashing?.frequency};
    }
    shapeDistractionDuration = Math.floor(Math.random() * (config.distractingShapeConfig.maxDuration - config.distractingShapeConfig.minDuration)) + config.distractingShapeConfig.minDuration;
  }

  if(distractionMode % 2 == 1 && config.backgroundDistractionConfig){ //Create background distraction
    backgroundDistraction = {
      color: config.backgroundDistractionConfig?.color,
      duration: Math.floor(Math.random() * (config.backgroundDistractionConfig?.maxDuration - config.backgroundDistractionConfig?.minDuration)) + config.backgroundDistractionConfig?.minDuration,
      flashing: config.backgroundDistractionConfig?.flashing ? {
        color: config.backgroundDistractionConfig?.flashing?.color,
        frequency: config.backgroundDistractionConfig?.flashing?.frequency
      } : undefined
    }
  }

  let round: IRound = {
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
