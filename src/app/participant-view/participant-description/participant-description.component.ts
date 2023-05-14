import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-participant-description',
  templateUrl: './participant-description.component.html',
  styleUrls: ['./participant-description.component.scss']
})
export class ParticipantDescriptionComponent implements OnInit{
  @Input() experimentId: string = "id1";
  @Output() nextStep = new EventEmitter();
  description: string;

  participantDescriptionForm = new FormGroup({
    conditionsCheckbox: new FormControl(false, Validators.requiredTrue),
    flashWarningCheckbox: new FormControl(false, Validators.requiredTrue)
  });


  constructor(private experimentService: ExperimentService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.experimentService.getDescription(this.experimentId).subscribe({
      next: (description) => {
        this.description = description;
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  onSubmit(): void{
    this.nextStep.emit();
  }
}
