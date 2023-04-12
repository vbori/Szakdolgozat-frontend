import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-experiment-basics',
  templateUrl: './experiment-basics.component.html',
  styleUrls: ['./experiment-basics.component.scss']
})

export class ExperimentBasicsComponent {
  @Input() experiment: Experiment | undefined
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  experimentBasicsForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    researcherDescription: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    maxParticipantNum: new FormControl<number>(20, [Validators.required, Validators.min(1), Validators.max(100)]),
    controlGroupSize: new FormControl<number>(5, [Validators.required, Validators.min(0), Validators.max(100)]) //TODO: add validator to check if controlGroupSize < maxParticipantNum
  });

  constructor(private experimentService: ExperimentService) { }

  onSubmit(){
    if(!this.experiment){
      this.createExperiment();
    }else if(!this.experimentBasicsForm.pristine){
      this.updateExperiment();
    }else{
      this.nextStep.emit();
    }
  }

  createExperiment(){
    this.experimentService.createExperiment(this.experimentBasicsForm.value).subscribe({
      next: (experiment) => {
        this.experiment = experiment;
        this.experimentBasicsForm.markAsPristine();
        this.experimentChange.emit(this.experiment);
        this.nextStep.emit();
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
  }

  updateExperiment(){
    this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: this.experimentBasicsForm.value}).subscribe({
      next: (experiment) => {
        this.experiment = experiment;
        this.experimentBasicsForm.markAsPristine();
        this.experimentChange.emit(this.experiment);
        this.nextStep.emit();
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
  }
}
