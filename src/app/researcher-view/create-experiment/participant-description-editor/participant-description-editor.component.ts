import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-participant-description-editor',
  templateUrl: './participant-description-editor.component.html',
  styleUrls: ['./participant-description-editor.component.scss']
})
export class ParticipantDescriptionEditorComponent {
  @Input() experiment: Experiment | undefined
  @Output() experimentChange = new EventEmitter<Experiment>();

  participantDescriptionForm = new FormGroup({
    participantDescription: new FormControl<string>('', [Validators.required, Validators.minLength(10)])
  });

  constructor(private experimentService: ExperimentService) { }

  onSubmit(){
    if(!this.participantDescriptionForm.pristine){
      this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: this.participantDescriptionForm.value}).subscribe({
        next: (experiment) => {
          this.experiment = experiment;
          console.log(this.experiment);
          this.participantDescriptionForm.markAsPristine();
          this.experimentChange.emit(this.experiment);
        },
        error: (error) => {
          console.log(error); //TODO: display error message
        }
      });
    }
  }
}
