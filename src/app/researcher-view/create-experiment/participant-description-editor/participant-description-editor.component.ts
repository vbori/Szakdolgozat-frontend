import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-participant-description-editor',
  templateUrl: './participant-description-editor.component.html',
  styleUrls: ['./participant-description-editor.component.scss', '../create-experiment.component.scss']
})
export class ParticipantDescriptionEditorComponent implements AfterViewInit{
  @Input() experiment: Experiment | undefined
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  participantDescriptionForm = new FormGroup({
    participantDescription: new FormControl<string>('Welcome to the experiment!', [Validators.required, Validators.minLength(10)])
  });

  constructor(private experimentService: ExperimentService) { }

  ngAfterViewInit(): void {
    if(this.experiment){
      this.participantDescriptionForm.patchValue({
        participantDescription: this.experiment.participantDescription
      });
    }
  }

  onSubmit(): void{
    if(!this.participantDescriptionForm.pristine){
      this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: this.participantDescriptionForm.value}).subscribe({
        next: (experiment) => {
          this.experiment = experiment;
          console.log("experiment updated in part desc")
          console.log(this.experiment);
          this.participantDescriptionForm.markAsPristine();
          this.experimentChange.emit(this.experiment);
          this.nextStep.emit();
        },
        error: (error) => {
          console.log(error); //TODO: display error message
        }
      });
    }else{
      this.nextStep.emit();
    }
  }
}
