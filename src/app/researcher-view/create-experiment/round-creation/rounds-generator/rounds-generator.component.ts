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

  roundGeneratorForm = new FormGroup({ //TODO: instead of magic numbers, use constants
    setNum: new FormControl<number>(1,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(100)]}),
    roundNum: new FormControl<number>(10,{nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(100)]}),
    practiceRoundNum: new FormControl<number>(3, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(10)]}),
    restTimeSec: new FormControl<number>(10, {nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(60)]}),
    backgroundColor: new FormControl<string>('#FFFFFF', {nonNullable: true, validators: [Validators.required]}),
    targetShapeColor: new FormControl<string>('#00FF00',{nonNullable: true, validators: [Validators.required]}),
    baseShapeColor: new FormControl<string>('#0000FF', {nonNullable: true, validators: [Validators.required]}),
    distractedRoundNum: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    useBackgroundDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    useShapeDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    changePosition: new FormControl<boolean>(false, {nonNullable: true}),
    changeShapeSize: new FormControl<boolean>(false, {nonNullable: true}),
    twoDimensional: new FormControl<boolean>(false, {nonNullable: true}),
    canvasHeight: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(100), Validators.max(1000)]}),
    canvasWidth: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(100), Validators.max(1000)]}),
    baseShapeType: new FormControl<string[]>([], {nonNullable: true, validators: [Validators.required]}),
    targetShapeType: new FormControl<string[]>([], {nonNullable: true, validators: [Validators.required]}),
    minWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
    maxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
    minHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
    maxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
    backgroundDistractionConfig : new FormGroup({
      backGroundDistractionColor: new FormControl<string>('#FF0000',{nonNullable: true, validators: [Validators.required]}),
      minDistractionDurationTime: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5000)]}),
      maxDistractionDurationTime: new FormControl<number>(2000, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5000)]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        flashColor: new FormControl<string>('#000000',{nonNullable: true, validators: [Validators.required]}),
        flashFrequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(100)]}),
      })
    },{
      validators: [
        ExperimentRoundsValidator.conflictingValuesValidator('minDistractionDurationTime','maxDistractionDurationTime')
      ]}),
    distractingShapeConfig: new FormGroup({
      distractingShapeMinWidth: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
      distractingShapeMaxWidth: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
      distractingShapeMinHeight: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
      distractingShapeMaxHeight: new FormControl<number>(60, {nonNullable: true, validators: [Validators.required, Validators.min(10), Validators.max(200)]}),
      distractingShapeTypes: new FormControl<string[]>([], {nonNullable: true, validators: [Validators.required]}),
      distractingShapeColor: new FormControl<string>('#FFA500', {nonNullable: true, validators: [Validators.required]}),
      minDistractionDurationTime: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5000)]}),
      maxDistractionDurationTime: new FormControl<number>(2000, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5000)]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        flashColor: new FormControl<string>('#FFFF00', {nonNullable: true, validators: [Validators.required]}),
        flashFrequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(100)]}),
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

  constructor(private experimentService: ExperimentService, private constants: ExperimentCreationConstants) { }

  ngOnInit(): void {
    this.roundGeneratorForm.get('backgroundDistractionConfig')?.disable();
    this.roundGeneratorForm.get('distractingShapeConfig')?.disable();

    this.roundGeneratorForm.get('useBackgroundDistraction')?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get('backgroundDistractionConfig')?.enable();
      }else{
        this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('useFlashing')?.setValue(false);
        this.roundGeneratorForm.get('backgroundDistractionConfig')?.disable();
      }
    });

    this.roundGeneratorForm.get('useShapeDistraction')?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get('distractingShapeConfig')?.enable();
      }else{
        this.roundGeneratorForm.get('distractingShapeConfig')?.get('useFlashing')?.setValue(false);
        this.roundGeneratorForm.get('distractingShapeConfig')?.disable();
      }
    });

    this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('useFlashing')?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('flashing')?.enable();
      }else{
        this.roundGeneratorForm.get('backgroundDistractionConfig')?.get('flashing')?.disable();
      }
    });

    this.roundGeneratorForm.get('distractingShapeConfig')?.get('useFlashing')?.valueChanges.subscribe(value => {
      if(value){
        this.roundGeneratorForm.get('distractingShapeConfig')?.get('flashing')?.enable();
      }else{
        this.roundGeneratorForm.get('distractingShapeConfig')?.get('flashing')?.disable();
      }
    });

  }

  onSubmit(){
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

  setUnnecessaryControlsAvailability(available: boolean){
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
