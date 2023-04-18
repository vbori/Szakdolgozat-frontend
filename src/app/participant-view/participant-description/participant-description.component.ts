import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-participant-description',
  templateUrl: './participant-description.component.html',
  styleUrls: ['./participant-description.component.scss']
})
export class ParticipantDescriptionComponent implements OnInit{
  @Input() experimentId: string;
  @Output() nextStep = new EventEmitter<any>();
  @Input() demoMode: boolean;
  description: string;

  participantDescriptionForm = new FormGroup({
    conditionsCheckbox: new FormControl(false, Validators.requiredTrue),
    flashWarningCheckbox: new FormControl(false, Validators.requiredTrue)
  });


  constructor(private experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.experimentService.getDescription(this.experimentId, this.demoMode).subscribe({
      next: (description) => {
        this.description = description;
      },
      error: (error) => {
        console.log("in participant-description.component.ts");
        console.log(error); //TODO: display error message
      }
    });
  }

  onSubmit(){
    this.nextStep.emit();
  }
}
