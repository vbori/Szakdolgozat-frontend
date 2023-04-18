import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuestionClass } from 'src/app/common/models/form.model';

@Component({
  selector: 'app-question-creation',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.scss']
})
export class QuestionCreationComponent implements AfterViewInit {
  @Input() question: QuestionClass;
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() questionChange = new EventEmitter<void>();
  @ViewChild('form', { read: NgForm, static: false }) form!: NgForm;
  answerTypes = ['text', 'number', 'radio', 'checkbox', 'select'];
  useValidation = false;

  ngAfterViewInit(){
    this.form.statusChanges?.subscribe((status) => {
      this.validityChange.emit(status === 'VALID');
    });

    this.form.valueChanges?.subscribe(() => {
      this.questionChange.emit();
    });
  }

  addOption() { //TODO: investigate why every time I add an option, the previous options are overwritten, but only on the UI
    this.question.options?.push({optionLabel: `option${this.question.options.length + 1}`});
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
}
