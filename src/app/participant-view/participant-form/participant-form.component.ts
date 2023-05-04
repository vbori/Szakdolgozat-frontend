import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Question } from 'src/app/common/models/form.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ParticipantService } from '../services/participant.service';
import { Response } from '../models/participant.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss']
})
export class ParticipantFormComponent implements OnInit{
  form: FormGroup   = new FormGroup({});
  questions : Question[];
  @Input() experimentId: string
  @Input() participantId: string;
  @Input() demoMode: boolean;
  @Output() nextStep = new EventEmitter<any>();

  constructor(private readonly experimentService: ExperimentService,
              private readonly participantService: ParticipantService,
              private readonly formBuilder: FormBuilder,
              private readonly changeDetector: ChangeDetectorRef,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
    this.experimentService.getForm(this.experimentId).subscribe({
      next: (form) => {
        this.questions = form.questions;
        this.questions.forEach(question => {
          if (question.validation) {
            this.form.addControl(question.questionId, this.formBuilder.control('', [Validators.min(question.validation?.min),Validators.max(question.validation?.max)]));
          } else {
            this.form.addControl(question.questionId, this.formBuilder.control(''));
          }
        });
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  onSubmit(): void{
    if(!this.demoMode){
      console.log(this.form.value);
      let responses: Response[] = [];

      Object.keys(this.form.value).forEach((key: string) => {
        const value = this.form.value[key];
        responses.push({questionId: key, response: value});
      });

      this.participantService.addResponses({participantId: this.participantId, responses: responses}).subscribe({
        next: () => {
          this.nextStep.emit();
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }else{
      this.nextStep.emit();
    }
  }
}
