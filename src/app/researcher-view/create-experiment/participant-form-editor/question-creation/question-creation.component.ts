import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Question } from 'src/app/common/models/form.model';
import { ExperimentCreationConstants } from '../../experiment-creation.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question-creation',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.scss']
})
export class QuestionCreationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() question: Question;
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() questionChange = new EventEmitter<void>();
  @ViewChild('form', { read: NgForm, static: false }) form!: NgForm;
  answerTypes = ['text', 'number', 'radio', 'checkbox', 'select'];
  useValidation = false;
  subsciptions: Subscription[] = [];

  constructor(public readonly constants : ExperimentCreationConstants) {}

  ngOnInit(): void {
      this.useValidation = this.question.validation !== undefined;
  }

  ngAfterViewInit(){
    let subscription = this.form.statusChanges?.subscribe((status) => {
      this.validityChange.emit(status === 'VALID');
    });

    let subsciption2 = this.form.valueChanges?.subscribe(() => {
      this.questionChange.emit();
    });

    if(subscription)
      this.subsciptions.push(subscription);


    if(subsciption2)
      this.subsciptions.push(subsciption2);
  }

  ngOnDestroy(){
    this.subsciptions.forEach((subscription) => subscription.unsubscribe());
  }

  addOption() {
    this.question.options?.push({optionLabel: `option${this.question.options.length + 1}`});
    console.log( this.question.options);
  }

  removeOption(index: number) {
    this.question.options?.splice(index, 1);
  }

  onValidationChange(){
    this.question.validation = this.useValidation ? {min: 0,  max:100} : undefined;
  }

  onSelectionChange(){
    this.question.options = this.question.type === 'select' || this.question.type === 'radio' ? [{optionLabel: 'option1'}, {optionLabel: 'option2'}] : undefined;
  }

  onOptionChange(index: number, event: Event){
    let target = event.target as HTMLInputElement;
    if(this.question.options && event.target)
      this.question.options[index].optionLabel = target.value;
  }
}
