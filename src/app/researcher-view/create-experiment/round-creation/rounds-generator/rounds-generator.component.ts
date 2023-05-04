import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentCreationConstants } from '../../experiment-creation.constants';
import { ExperimentRoundsValidator } from 'src/app/common/validators/experiment-rounds.validator';
import { Experiment } from 'src/app/common/models/experiment.model';
import { Round, Shape } from 'src/app/common/models/round.model';
import { ConfigShapeType, ExperimentConfiguration } from 'src/app/common/models/config.model';
import { createInitialShape, chooseDistractedRoundIndexes, calculateMaxSpace, createRound } from 'src/app/researcher-view/utils/generatorUtils';
import { markControlsTouched } from 'src/app/researcher-view/utils/formUtils';
import { ToastrService } from 'ngx-toastr';

interface ShapeOption {
  value: ConfigShapeType;
  viewValue: string;
}

@Component({
  selector: 'app-rounds-generator',
  templateUrl: './rounds-generator.component.html',
  styleUrls: ['./rounds-generator.component.scss']
})

export class RoundsGeneratorComponent implements OnInit{

  @Input() experiment: Experiment | undefined
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  shapeOptions: ShapeOption[] = [
    {value: 'rect', viewValue: 'Rectangle'},
    {value: 'circle', viewValue: 'Circle'},
    {value: 'square', viewValue: 'Square'},
  ];

  roundGeneratorForm = new FormGroup({
    setNum: new FormControl<number>(1,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM),Validators.pattern("^[0-9]*$")]}),
    roundNum: new FormControl<number>(10,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM),Validators.pattern("^[0-9]*$") ]}),
    backgroundColor: new FormControl<string>('#FFFFFF', {nonNullable: true, validators: [Validators.required]}),
    targetShapeColor: new FormControl<string>('#00FF00',{nonNullable: true, validators: [Validators.required]}),
    baseShapeColor: new FormControl<string>('#0000FF', {nonNullable: true, validators: [Validators.required]}),
    distractedRoundNum: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]}),
    useBackgroundDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    useShapeDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    changePosition: new FormControl<boolean>(true, {nonNullable: true}),
    changeShapeSize: new FormControl<boolean>(true, {nonNullable: true}),
    twoDimensional: new FormControl<boolean>(false, {nonNullable: true}),
    canvasHeight: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_HEIGHT), Validators.max(this.constants.MAX_CANVAS_HEIGHT),Validators.pattern("^[0-9]*$")]}),
    canvasWidth: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_WIDTH), Validators.max(this.constants.MAX_CANVAS_WIDTH),Validators.pattern("^[0-9]*$")]}),
    baseShapeTypes: new FormControl<string[]>(['rect'], {nonNullable: true, validators: [Validators.required]}),
    targetShapeTypes: new FormControl<string[]>(['circle'], {nonNullable: true, validators: [Validators.required]}),
    minWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    maxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    minHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    maxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE),Validators.pattern("^[0-9]*$")]}),
    backgroundDistractionConfig : new FormGroup({
      color: new FormControl<string>('#FF0000',{nonNullable: true, validators: [Validators.required]}),
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
    ]}
  );

  //TODO: add refresh guard

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
    this.roundGeneratorForm.get(checkboxControlName)?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get(configFormName)?.enable();
      }else{
        this.roundGeneratorForm.get(configFormName)?.disable();
        this.roundGeneratorForm.get(configFormName)?.get('useFlashing')?.setValue(false);
      }
    });
  }

  subscribeToFlashingChange(configFormName: string): void {
    this.roundGeneratorForm.get(configFormName)?.get('useFlashing')?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get(configFormName)?.get('flashing')?.enable();
      }else{
        this.roundGeneratorForm.get(configFormName)?.get('flashing')?.disable();
      }
    });
  }

  onSubmit(): void{
    if(!this.roundGeneratorForm.pristine){
      this.setUnnecessaryControlsAvailability(false);
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

  generateRounds(config: ExperimentConfiguration): Round[]{
    let rounds: Round[] = [];

    let {normalMaxSpace, distractionMaxSpace } = calculateMaxSpace(config.canvasWidth, config.minWidth, config.maxWidth, config.distractingShapeConfig?.minWidth, config.distractingShapeConfig?.maxWidth);
    let baseShape: Shape = createInitialShape(config.canvasHeight ,config.baseShapeTypes, config.minWidth, Math.min(normalMaxSpace, config.maxWidth), config.minHeight, config.maxHeight, config.baseShapeColor, false, false);
    baseShape.left = Math.floor(Math.random() * (normalMaxSpace - baseShape.width));

    let restrictedHeight = config.twoDimensional ? config.maxHeight : Math.min(config.canvasHeight - baseShape.top, config.maxHeight);

    let initialTargetWidth:number|undefined = undefined;
    let initialTargetHeight:number|undefined = undefined;
    let initialTargetLeft:number|undefined = undefined;
    let initialTargetTop:number|undefined = undefined;

    for(let i = 0; i < config.setNum; i++){
      let targetShape: Shape = createInitialShape(config.canvasHeight ,config.targetShapeTypes, initialTargetWidth ?? config.minWidth, initialTargetWidth ?? Math.min(normalMaxSpace, config.maxWidth), initialTargetHeight ?? config.minHeight, initialTargetHeight ?? restrictedHeight, config.targetShapeColor, true, false);
      targetShape.left = initialTargetLeft ?? config.canvasWidth - (targetShape.width + Math.floor(Math.random() * (normalMaxSpace- targetShape.width)));
      targetShape.top = initialTargetTop ?? targetShape.top;

      if(config.twoDimensional){
        targetShape.top = baseShape.top;
      }

      if(!config.changeShapeSize && initialTargetHeight === undefined){
        initialTargetHeight = targetShape.height;
        initialTargetWidth = targetShape.width;
      }

      if(!config.changePosition && initialTargetLeft === undefined){
        initialTargetLeft = targetShape.left;
        initialTargetTop = targetShape.top;
      }

      const distractedRoundIndexes = chooseDistractedRoundIndexes(config.roundNum, config.distractedRoundNum);

      for(let j = 0; j < config.roundNum; j++){
        let distractionMode = 0;
        if(distractedRoundIndexes.includes(j)){
          if(config.backgroundDistractionConfig && config.distractingShapeConfig){
            distractionMode = Math.floor(Math.random() * 3) + 1;
          }else if(config.backgroundDistractionConfig){
            distractionMode = 1;
          }else if(config.distractingShapeConfig){
            distractionMode = 2;
          }
        }  //0:no distraction 1: background distraction only, 2: shape distraction only, 3: shape distraction + background distraction
        let round = createRound(j+1, config, baseShape, targetShape, distractionMode, distractionMaxSpace, restrictedHeight, normalMaxSpace);
        rounds.push(round);
      }
    }

    return rounds;
  }
}
