import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormService } from '../../services/form.service';
import { IQuestion, Question } from 'src/app/common/models/form.model';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ToastrService } from 'ngx-toastr';
import { ExperimentCreationConstants } from '../experiment-creation.constants';

@Component({
  selector: 'app-participant-form-editor',
  templateUrl: './participant-form-editor.component.html',
  styleUrls: ['./participant-form-editor.component.scss']
})
export class ParticipantFormEditorComponent implements OnInit{
  @Input() experiment: Experiment | undefined = undefined;
  @Input() isDirty: boolean = false;
  @Output() nextStep = new EventEmitter();
  @Output() experimentChange = new EventEmitter<Experiment>();
  questions: IQuestion[] = [new Question('question1', 'Question 1')];
  isQuestionValid: Boolean[] = [true];

  constructor(private readonly formService: FormService,
              private readonly experimentService: ExperimentService,
              private toastr: ToastrService,
              public readonly constants : ExperimentCreationConstants) { }

  ngOnInit(): void {
    if(this.experiment?.formId){
      this.formService.getForm(this.experiment._id).subscribe({
        next: (form) => {
          this.questions = form.questions.map((question) => new Question(question.questionId, question.label, question.type, question.options, question.validation, question.required));
          this.isQuestionValid = this.questions.map(() => true);
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }else if(this.questions.length > 1){
      this.questions.splice(1);
      this.isQuestionValid.splice(1);
      this.questions[0].label = 'Question 1';
      this.questions[0].questionId = 'question1';
      this.isQuestionValid[0] = true;
    }
  }

  addQuestion(): void{
    this.questions.push(new Question(`question${this.questions.length + 1}`, `Question ${this.questions.length + 1}`));
    this.isQuestionValid.push(true);
  }

  removeQuestion(index: number): void{
    this.questions.splice(index, 1);
    this.isQuestionValid.splice(index, 1);
  }

  saveForm(): void{
    if(!this.experiment?.formId){
      this.createForm();
    }else if(this.isDirty){
      this.updateForm();
    }else{
      this.nextStep.emit();
    }

    this.isDirty = false;
  }

  formNotNeeded(): void{
    if(this.experiment)
    this.formService.deleteForm(this.experiment._id).subscribe({
      next: () => {
        if(this.experiment){
          this.experimentService.getExperimentById(this.experiment._id).subscribe({
            next: (experiment) => {
              this.experiment = experiment;
              this.toastr.success('Form deleted', 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
              this.experimentChange.emit(this.experiment);
              this.nextStep.emit();
            },
            error: (error) => {
              this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
            }
          });
        }
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  createForm(): void{
    if(this.experiment)
    this.formService.addForm(this.experiment._id, this.questions).subscribe({
      next: () => {
        if(this.experiment){
          this.experimentService.getExperimentById(this.experiment._id).subscribe({
            next: (experiment) => {
              this.experiment = experiment;
              this.toastr.success('Form created', 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
              this.experimentChange.emit(this.experiment);
              this.nextStep.emit();
            },
            error: (error) => {
              this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
            }
          });
        }
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  updateForm(): void{
    if(this.experiment)
    this.formService.updateForm(this.experiment._id, this.questions).subscribe({
      next: () => {
        this.toastr.success('Form updated', 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
        this.nextStep.emit();
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  onValidityChange(index: number, valid: boolean): void {
    this.isQuestionValid[index] = valid;
  }

  onQuestionChange(): void {
    this.isDirty = true;
  }
}
