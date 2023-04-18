import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentCreationConstants } from '../experiment-creation.constants';

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
    maxParticipantNum: new FormControl<number>(20, [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_PARTICIPANT_NUM)]),
    controlGroupChance: new FormControl<number>(20, [Validators.required, Validators.min(0), Validators.max(100)])
  });

  constructor(private experimentService: ExperimentService, private constants: ExperimentCreationConstants) { }

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
    let {name, researcherDescription, maxParticipantNum, controlGroupChance} = this.experimentBasicsForm.value;
    if(name && researcherDescription && maxParticipantNum && controlGroupChance)
      this.experimentService.createExperiment(name, researcherDescription,
        maxParticipantNum, controlGroupChance).subscribe({
        next: (experiment) => {
          console.log("created experiment")
          console.log(experiment)
          this.experiment = experiment;
          console.log("savedexperiment ")
          console.log(this.experiment)
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
        console.log("updated experiment")
        console.log(experiment)
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
