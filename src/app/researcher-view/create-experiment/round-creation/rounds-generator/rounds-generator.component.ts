import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentCreationConstants } from '../../experiment-creation.constants';
import { ExperimentRoundsValidator } from 'src/app/common/validators/experiment-rounds.validator';
import { Experiment } from 'src/app/common/models/experiment.model';

@Component({
  selector: 'app-rounds-generator',
  templateUrl: './rounds-generator.component.html',
  styleUrls: ['./rounds-generator.component.scss']
})

export class RoundsGeneratorComponent implements OnInit{

  @Input() experiment: Experiment | undefined
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  shapeTypes = ['Circle', 'Square', 'Rectangle'] //TODO: get this from the interface Object.values<ShapeType>({} as {[K in ShapeType]: K});

  roundGeneratorForm = new FormGroup({
    setNum: new FormControl<number>(1,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM)]}),
    roundNum: new FormControl<number>(10,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM)]}),
    backgroundColor: new FormControl<string>('#FFFFFF', {nonNullable: true, validators: [Validators.required]}),
    targetShapeColor: new FormControl<string>('#00FF00',{nonNullable: true, validators: [Validators.required]}),
    baseShapeColor: new FormControl<string>('#0000FF', {nonNullable: true, validators: [Validators.required]}),
    distractedRoundNum: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    useBackgroundDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    useShapeDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    changePosition: new FormControl<boolean>(false, {nonNullable: true}),
    changeShapeSize: new FormControl<boolean>(false, {nonNullable: true}),
    twoDimensional: new FormControl<boolean>(false, {nonNullable: true}),
    canvasHeight: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_HEIGHT), Validators.max(this.constants.MAX_CANVAS_HEIGHT)]}),
    canvasWidth: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_WIDTH), Validators.max(this.constants.MAX_CANVAS_WIDTH)]}),
    baseShapeType: new FormControl<string[]>([], {nonNullable: true, validators: [Validators.required]}),
    targetShapeType: new FormControl<string[]>([], {nonNullable: true, validators: [Validators.required]}),
    minWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
    maxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
    minHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
    maxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
    backgroundDistractionConfig : new FormGroup({
      backGroundDistractionColor: new FormControl<string>('#FF0000',{nonNullable: true, validators: [Validators.required]}),
      minDistractionDurationTime: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME)]}),
      maxDistractionDurationTime: new FormControl<number>(5000, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME)]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        color: new FormControl<string>('#000000',{nonNullable: true, validators: [Validators.required]}),
        frequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY)]}),
      })
    },{
      validators: [
        ExperimentRoundsValidator.conflictingValuesValidator('minDistractionDurationTime','maxDistractionDurationTime')
      ]}),
    distractingShapeConfig: new FormGroup({
      distractingShapeMinWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
      distractingShapeMaxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
      distractingShapeMinHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
      distractingShapeMaxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
      distractingShapeTypes: new FormControl<string[]>([], {nonNullable: true, validators: [Validators.required]}),
      distractingShapeColor: new FormControl<string>('#FFA500', {nonNullable: true, validators: [Validators.required]}),
      minDistractionDurationTime: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME)]}),
      maxDistractionDurationTime: new FormControl<number>(2000, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME)]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        color: new FormControl<string>('#FFFF00', {nonNullable: true, validators: [Validators.required]}),
        frequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY)]}),
      })
    },{
      validators: [
        ExperimentRoundsValidator.conflictingValuesValidator('distractingShapeMinWidth', 'distractingShapeMaxWidth'),
        ExperimentRoundsValidator.conflictingValuesValidator('distractingShapeMinHeight', 'distractingShapeMaxHeight'),
        ExperimentRoundsValidator.conflictingValuesValidator('minDistractionDurationTime','maxDistractionDurationTime')
      ]})
  }, {
    validators: [
      ExperimentRoundsValidator.conflictingValuesValidator('distractedRoundNum', 'roundNum'),
      ExperimentRoundsValidator.conflictingValuesValidator('minWidth', 'maxWidth'),
      ExperimentRoundsValidator.conflictingValuesValidator('minHeight', 'maxHeight'),
      ExperimentRoundsValidator.noDistractionSelectedValidator( 'distractedRoundNum','useBackgroundDistraction', 'useShapeDistraction'),
      ExperimentRoundsValidator.tooManyTotalRoundsValidator(this.constants.MAX_TOTAL_EXPERIMENT_ROUND_NUM, 'roundNum', 'setNum')
    ]}
  );

  //TODO: add refresh guard

  constructor(private experimentService: ExperimentService, public readonly constants: ExperimentCreationConstants) {
  }

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
      this.roundGeneratorForm.get('useBackgroundDistraction')?.setValue(this.experiment.experimentConfiguration.backgroundDistractionConfig !== undefined);
      this.roundGeneratorForm.get('useShapeDistraction')?.setValue(this.experiment.experimentConfiguration.distractingShapeConfig !== undefined);
      this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('useFlashing')?.setValue(this.experiment.experimentConfiguration.backgroundDistractionConfig?.flashing !== undefined);
      this.roundGeneratorForm.get('distractingShapeConfig')?.get('useFlashing')?.setValue(this.experiment.experimentConfiguration.distractingShapeConfig?.flashing !== undefined);
    }
  }

  initializeForm(): void{
    this.roundGeneratorForm.get('backgroundDistractionConfig')?.disable();
    this.roundGeneratorForm.get('distractingShapeConfig')?.disable();

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
    this.setUnnecessaryControlsAvailability(false);
    const experimentConfiguration = { experimentConfiguration: this.roundGeneratorForm.value};
    if(!this.roundGeneratorForm.pristine){
      this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: experimentConfiguration}).subscribe({
        next: (experiment) => {
          this.experiment = experiment;
          this.roundGeneratorForm.markAsPristine();
          this.experimentChange.emit(this.experiment);
          this.nextStep.emit();
        },
        error: (error) => {
          console.log(error); //TODO: display error message
        }
      });
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
}
