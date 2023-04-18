import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormService } from '../../services/form.service';
import { Question, QuestionClass } from 'src/app/common/models/form.model';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-participant-form-editor',
  templateUrl: './participant-form-editor.component.html',
  styleUrls: ['./participant-form-editor.component.scss']
})
export class ParticipantFormEditorComponent{
  @Input() experiment: Experiment | undefined;
  @Input() isDirty: boolean = false;
  @Output() nextStep = new EventEmitter<any>();
  @Output() experimentChange = new EventEmitter<any>();
  questions: Question[] = [new QuestionClass('question1', 'Question 1')];
  isQuestionValid: Boolean[] = [true];

  constructor(private readonly formService: FormService, private readonly experimentService: ExperimentService) { }

  addQuestion() {
    this.questions.push(new QuestionClass(`question${this.questions.length + 1}`, `Question ${this.questions.length + 1}`));
    this.isQuestionValid.push(true);
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
    this.isQuestionValid.splice(index, 1);
  }

  saveForm() {
    if(!this.experiment?.formId){
      this.createForm();
    }else if(this.isDirty){
      this.updateForm();
    }else{
      this.nextStep.emit();
    }

    this.isDirty = false;
  }

  noForm(){
    if(this.experiment)
    this.formService.deleteForm(this.experiment._id).subscribe({
      next: () => {
        if(this.experiment)
        this.experimentService.getExperimentById(this.experiment._id).subscribe({
          next: (experiment) => {
            this.experiment = experiment;
            this.experimentChange.emit(this.experiment);
            this.nextStep.emit();
          },
          error: (error) => {
            console.log(error); //TODO: handle error
          }
        });
      },
      error: (error) => {
        console.log(error); //TODO: handle error
      }
    });
  }

  createForm(){
    if(this.experiment)
    this.formService.addForm(this.experiment._id, this.questions).subscribe({
      next: () => {
        if(this.experiment)
        this.experimentService.getExperimentById(this.experiment._id).subscribe({
          next: (experiment) => {
            this.experiment = experiment;
            this.experimentChange.emit(this.experiment);
            this.nextStep.emit();
          },
          error: (error) => {
            console.log(error); //TODO: handle error
          }
        });
      },
      error: (error) => {
        console.log(error); //TODO: handle error
      }
    });
  }

  updateForm(){
    if(this.experiment)
    this.formService.updateForm(this.experiment._id, this.questions).subscribe({
      next: (response) => {
        console.log(response.body?.message) //TODO: display message for user
      },
      error: (response) => {
        console.log(response.error.message); //TODO: handle error
      }
    });
  }

  isSubmitDisabled(): boolean {
    return this.isQuestionValid.includes(false);
  }

  onValidityChange(index: number, valid: boolean) {
    this.isQuestionValid[index] = valid;
  }

  onQuestionChange() {
    this.isDirty = true;
  }
}
