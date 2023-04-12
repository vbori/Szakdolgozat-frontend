import { FormControl } from "@angular/forms";

export interface RoundGeneratorForm {
  setnum: FormControl<number>;
  roundNum: FormControl<number>;
  practiceRoundNum: FormControl<number>;
  restTimeSec: FormControl<number>;
  backgroundColors: FormControl<string[]>;
  shapeColors: FormControl<string>;
  distractedRoundNum: FormControl<number>;
  changePosition?: FormControl<boolean>;
  canvasHeight: FormControl<number>;
  canvasWidth: FormControl<number>;
  baseShapeType: FormControl<string[]>;
  targetShapeType: FormControl<string[]>;
  minWidth: FormControl<number>;
  maxWidth: FormControl<number>;
  minHeight: FormControl<number>;
  maxHeight: FormControl<number>;
  backGroundDistractionConfig?: backGroundDistractionConfigForm;
  distractingShapeConfig?: distractingShapeConfigForm;
}

interface distractingShapeConfigForm {
  distractingShapeMinWidth: FormControl<number>;
  distractingShapeMaxWidth: FormControl<number>;
  distractingShapeMinHeight: FormControl<number>;
  distractingShapeMaxHeight: FormControl<number>;
  distractingShapeTypes: FormControl<string[]>;
  distractingShapeColors: FormControl<string[]>;
  minDistractionDurationTime: FormControl<number>;
  maxDistractionDurationTime: FormControl<number>;
  useFlashing: FormControl<boolean>;
  flashing?: flashingForm;
}

interface backGroundDistractionConfigForm {
  minDistractionDurationTime: FormControl<number>;
  maxDistractionDurationTime: FormControl<number>;
  useFlashing: FormControl<boolean>;
  flashing?: flashingForm;
}

interface flashingForm {
  flashColor: FormControl<string>;
  flashFrequency: FormControl<number>;
}

export interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}
