import { Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentCreationConstants } from '../../experiment-creation.constants';
import { ExperimentRoundsValidator } from 'src/app/researcher-view/services/validators/experiment-rounds.validator';
import { Experiment } from 'src/app/common/models/experiment.model';
import { IRound } from 'src/app/common/models/round.model';
import { ConfigShapeType, ExperimentConfiguration } from 'src/app/researcher-view/models/config.model';
import { createInitialShape, chooseDistractedRoundIndexes, calculateMaxSpace, createRound } from 'src/app/researcher-view/utils/generatorUtils';
import { ToastrService } from 'ngx-toastr';
import { IShape } from 'src/app/common/models/shape.model';
import { Subscription } from 'rxjs';

interface ShapeOption {
  value: ConfigShapeType;
  viewValue: string;
}

@Component({
  selector: 'app-rounds-generator',
  templateUrl: './rounds-generator.component.html',
  styleUrls: ['./rounds-generator.component.scss']
})

export class RoundsGeneratorComponent implements OnInit, OnDestroy{

  @Input() experiment: Experiment | undefined = undefined;
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  shapeOptions: ShapeOption[] = [
    {value: 'rect', viewValue: 'Rectangle'},
    {value: 'circle', viewValue: 'Circle'},
    {value: 'square', viewValue: 'Square'},
  ];

  subscriptions: Subscription[] = [];

  roundGeneratorForm = new FormGroup({
    setNum: new FormControl<number>(1,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM),Validators.pattern("^[0-9]*$")]}),
    roundNum: new FormControl<number>(5,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM),Validators.pattern("^[0-9]*$") ]}),
    backgroundColor: new FormControl<string>('#ffffff', {nonNullable: true, validators: [Validators.required]}),
    targetShapeColor: new FormControl<string>('#ff0000',{nonNullable: true, validators: [Validators.required]}),
    baseShapeColor: new FormControl<string>('#0000ff', {nonNullable: true, validators: [Validators.required]}),
    distractedRoundNum: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]}),
    useBackgroundDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    useShapeDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    changePosition: new FormControl<boolean>(true, {nonNullable: true}),
    changeShapeSize: new FormControl<boolean>(true, {nonNullable: true}),
    oneDimensional: new FormControl<boolean>(false, {nonNullable: true}),
    canvasHeight: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_HEIGHT), Validators.max(this.constants.MAX_CANVAS_HEIGHT),Validators.pattern("^[0-9]*$")]}),
    canvasWidth: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_WIDTH), Validators.max(this.constants.MAX_CANVAS_WIDTH),Validators.pattern("^[0-9]*$")]}),
    baseShapeTypes: new FormControl<string[]>(['rect'], {nonNullable: true, validators: [Validators.required]}),
    targetShapeTypes: new FormControl<string[]>(['circle'], {nonNullable: true, validators: [Validators.required]}),
    minWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    maxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    minHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    maxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    backgroundDistractionConfig : new FormGroup({
      color: new FormControl<string>('#ff0000',{nonNullable: true, validators: [Validators.required]}),
      minDuration: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME),Validators.pattern("^[0-9]*$")]}),
      maxDuration: new FormControl<number>(5000, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME),Validators.pattern("^[0-9]*$")]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        color: new FormControl<string>('#000000',{nonNullable: true, validators: [Validators.required]}),
        frequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY),Validators.pattern("^[0-9]*$")]}),
      })
    },{
      validators: [
        ExperimentRoundsValidator.conflictingValuesValidator('minDuration','maxDuration')
      ]}),
    distractingShapeConfig: new FormGroup({
      minWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
      maxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
      minHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
      maxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
      distractingShapeTypes: new FormControl<string[]>(['square'], {nonNullable: true, validators: [Validators.required]}),
      color: new FormControl<string>('#FFA500', {nonNullable: true, validators: [Validators.required]}),
      minDuration: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME),Validators.pattern("^[0-9]*$")]}),
      maxDuration: new FormControl<number>(2000, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME),Validators.pattern("^[0-9]*$")]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        color: new FormControl<string>('#FFFF00', {nonNullable: true, validators: [Validators.required]}),
        frequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY),Validators.pattern("^[0-9]*$")]}),
      })
    },{
      validators: [
        ExperimentRoundsValidator.conflictingValuesValidator('minWidth', 'maxWidth'),
        ExperimentRoundsValidator.conflictingValuesValidator('minHeight', 'maxHeight'),
        ExperimentRoundsValidator.conflictingValuesValidator('minDuration','maxDuration')
      ]})
  }, {
    validators: [
      ExperimentRoundsValidator.conflictingValuesValidator('distractedRoundNum', 'roundNum'),
      ExperimentRoundsValidator.conflictingValuesValidator('minWidth', 'maxWidth'),
      ExperimentRoundsValidator.conflictingValuesValidator('minHeight', 'maxHeight'),
      ExperimentRoundsValidator.conflictingValuesValidator('maxWidth','canvasWidth'),
      ExperimentRoundsValidator.conflictingValuesValidator('maxHeight','canvasHeight'),
      ExperimentRoundsValidator.conflictingValuesValidator('maxHeight','canvasHeight', 'distractingShapeConfig'),
      ExperimentRoundsValidator.conflictingValuesValidator('maxWidth','canvasWidth', 'distractingShapeConfig'),
      ExperimentRoundsValidator.shapesOverlapValidator('canvasWidth',  'minWidth', 'distractingShapeConfig.minWidth', 'useShapeDistraction'),
      ExperimentRoundsValidator.noDistractionSelectedValidator( 'distractedRoundNum','useBackgroundDistraction', 'useShapeDistraction'),
      ExperimentRoundsValidator.tooManyTotalRoundsValidator(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM, 'roundNum', 'setNum'),
      ExperimentRoundsValidator.canvasHeightSmallerThanMaxShapeWidthValidator('canvasHeight', 'maxWidth', 'distractingShapeConfig', 'maxWidth', 'useShapeDistraction', 'baseShapeTypes', 'targetShapeTypes', 'distractingShapeTypes'),
    ]}
  );

  constructor(private experimentService: ExperimentService,
              public readonly constants: ExperimentCreationConstants,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    if(this.experiment?.experimentConfiguration){
      this.restoreForm();
    }else{
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  restoreForm(): void{
    if(this.experiment?.experimentConfiguration){
      this.roundGeneratorForm.patchValue(this.experiment.experimentConfiguration);
      this.subscribeToChanges();
      this.roundGeneratorForm.get('useBackgroundDistraction')?.setValue(this.experiment.experimentConfiguration.backgroundDistractionConfig !== undefined);
      this.roundGeneratorForm.get('useShapeDistraction')?.setValue(this.experiment.experimentConfiguration.distractingShapeConfig !== undefined);
      this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('useFlashing')?.setValue(this.experiment.experimentConfiguration.backgroundDistractionConfig?.flashing !== undefined);
      this.roundGeneratorForm.get('distractingShapeConfig')?.get('useFlashing')?.setValue(this.experiment.experimentConfiguration.distractingShapeConfig?.flashing !== undefined);
    }
  }

  initializeForm(): void{
    this.roundGeneratorForm.get('backgroundDistractionConfig')?.disable();
    this.roundGeneratorForm.get('distractingShapeConfig')?.disable();
    this.subscribeToChanges();
  }

  subscribeToChanges(): void{
    this.subscribeToDistractionChange('useBackgroundDistraction', 'backgroundDistractionConfig');
    this.subscribeToDistractionChange('useShapeDistraction', 'distractingShapeConfig');

    this.subscribeToFlashingChange('backgroundDistractionConfig');
    this.subscribeToFlashingChange('distractingShapeConfig');
  }

  subscribeToDistractionChange(checkboxControlName: string, configFormName: string): void {
    let subscription = this.roundGeneratorForm.get(checkboxControlName)?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get(configFormName)?.enable();
      }else{
        this.roundGeneratorForm.get(configFormName)?.disable();
        this.roundGeneratorForm.get(configFormName)?.get('useFlashing')?.setValue(false);
      }
    });

    if(subscription){
      this.subscriptions.push(subscription);
    }
  }

  subscribeToFlashingChange(configFormName: string): void {
    let subscription = this.roundGeneratorForm.get(configFormName)?.get('useFlashing')?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get(configFormName)?.get('flashing')?.enable();
      }else{
        this.roundGeneratorForm.get(configFormName)?.get('flashing')?.disable();
      }
    });

    if(subscription){
      this.subscriptions.push(subscription);
    }
  }

  onSubmit(): void{
    if(!this.roundGeneratorForm.pristine || !this.experiment?.experimentConfiguration){
      this.setUnnecessaryControlsAvailability(false);
      this.toastr.info('Generating rounds', 'Please wait', { progressBar: true, positionClass: 'toast-bottom-right' });
      const rounds = this.generateRounds(this.roundGeneratorForm.value as ExperimentConfiguration);
      const updatedExperiment = { experimentConfiguration: this.roundGeneratorForm.value, rounds: rounds};
      this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: updatedExperiment}).subscribe({
        next: (experiment) => {
          this.experiment = experiment;
          this.toastr.success('Rounds generated', 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
          this.roundGeneratorForm.markAsPristine();
          this.experimentChange.emit(this.experiment);
          this.nextStep.emit();
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }else{
      this.nextStep.emit();
    }
    this.setUnnecessaryControlsAvailability(true);
  }

  setUnnecessaryControlsAvailability(available: boolean): void{
    if(available){
      this.roundGeneratorForm.get('useBackgroundDistraction')?.enable();
      this.roundGeneratorForm.get('useShapeDistraction')?.enable();
      this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('useFlashing')?.enable();
      this.roundGeneratorForm.get('distractingShapeConfig')?.get('useFlashing')?.enable();
    }else{
      this.roundGeneratorForm.get('useBackgroundDistraction')?.disable();
      this.roundGeneratorForm.get('useShapeDistraction')?.disable();
      this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('useFlashing')?.disable();
      this.roundGeneratorForm.get('distractingShapeConfig')?.get('useFlashing')?.disable();
    }
  }

  generateRounds(config: ExperimentConfiguration): IRound[]{

    let {normalMaxSpace, distractionMaxSpace } = calculateMaxSpace(config.canvasWidth, config.minWidth, config.distractingShapeConfig?.minWidth);

    const baseShape = this.createBaseShape(config, normalMaxSpace);

    let restrictedHeight = this.calculateRestrictedHeight(config, baseShape);

    let initialTargetWidth, initialTargetHeight, initialTargetLeft, initialTargetTop :number|undefined = undefined;
    let rounds: IRound[] = [];

    for(let i = 0; i < config.setNum; i++){
      let {targetShape, initialTargetWidth: newInitialTargetWidth, initialTargetHeight: newInitialTargetHeight, initialTargetLeft: newInitialTargetLeft, initialTargetTop: newInitialTargetTop} = this.createTargetShape(config, initialTargetWidth, initialTargetHeight, initialTargetLeft, initialTargetTop, normalMaxSpace, baseShape.top, restrictedHeight);
      initialTargetWidth = newInitialTargetWidth;
      initialTargetHeight = newInitialTargetHeight;
      initialTargetLeft = newInitialTargetLeft;
      initialTargetTop = newInitialTargetTop;

      const distractedRoundIndexes = chooseDistractedRoundIndexes(config.roundNum, config.distractedRoundNum);

      for(let j = 0; j < config.roundNum; j++){
        let distractionMode = 0;
        if(distractedRoundIndexes.includes(j)){
          distractionMode = this.getDistractionMode(config);
        }
        let round = createRound(i*config.roundNum + j+1, config, baseShape, targetShape, distractionMode, distractionMaxSpace, restrictedHeight, normalMaxSpace);
        rounds.push(round);
      }
    }

    return rounds;
  }

  calculateRestrictedHeight(config: ExperimentConfiguration, baseShape: IShape): number{
    return config.oneDimensional ? Math.min(config.canvasHeight - baseShape.top, config.maxHeight) : config.maxHeight;
  }

  getDistractionMode(config: ExperimentConfiguration): number{ //0:no distraction 1: background distraction only, 2: shape distraction only, 3: shape distraction + background distraction
    if(config.backgroundDistractionConfig && config.distractingShapeConfig){
      return Math.floor(Math.random() * 3) + 1;
    }else if(config.backgroundDistractionConfig){
      return 1;
    }else if(config.distractingShapeConfig){
      return 2;
    }else{
      return 0;
    }
  }

  createBaseShape(config: ExperimentConfiguration, normalMaxSpace: number): IShape{
    let baseShape: IShape = createInitialShape(config.canvasHeight ,config.baseShapeTypes, config.minWidth, Math.min(normalMaxSpace, config.maxWidth), config.minHeight, config.maxHeight, config.baseShapeColor, false, false);
    baseShape.left = Math.floor(Math.random() * (normalMaxSpace - baseShape.width)); //Putting the shape somewhere between 0 and the last possible position

    return baseShape;
  }


  createTargetShape(config: ExperimentConfiguration, initialTargetWidth: number|  undefined, initialTargetHeight: number | undefined, initialTargetLeft: number | undefined, initialTargetTop: number| undefined , normalMaxSpace: number, baseShapeTop: number, restrictedHeight: number): {targetShape: IShape, initialTargetWidth: number|undefined, initialTargetHeight: number| undefined, initialTargetLeft: number | undefined, initialTargetTop: number | undefined}{
    let targetShape: IShape = createInitialShape(config.canvasHeight ,config.targetShapeTypes, initialTargetWidth ?? config.minWidth, initialTargetWidth ?? Math.min(normalMaxSpace, config.maxWidth), initialTargetHeight ?? config.minHeight, initialTargetHeight ?? restrictedHeight, config.targetShapeColor, true, false);
    targetShape.left = initialTargetLeft ?? config.canvasWidth - (targetShape.width + Math.floor(Math.random() * (normalMaxSpace- targetShape.width)));
    targetShape.top = initialTargetTop ?? targetShape.top;

    if(config.oneDimensional){
      targetShape.top = baseShapeTop + targetShape.height <= config.canvasHeight ?  baseShapeTop : config.canvasHeight - targetShape.height;
    }

    if(!config.changeShapeSize && initialTargetHeight === undefined){
      initialTargetHeight = targetShape.height;
      initialTargetWidth = targetShape.width;
    }

    if(!config.changePosition && initialTargetLeft === undefined){
      initialTargetLeft = targetShape.left;
      initialTargetTop = targetShape.top;
    }

    return {targetShape, initialTargetWidth, initialTargetHeight, initialTargetLeft, initialTargetTop};
  }

}
