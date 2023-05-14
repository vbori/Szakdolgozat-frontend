import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { QuestionCreationComponent } from './question-creation.component';

describe('QuestionCreationComponent', () => {
  let component: QuestionCreationComponent;
  let fixture: ComponentFixture<QuestionCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionCreationComponent ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        FormsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCreationComponent);
    component = fixture.componentInstance;
    component.question = {questionId: 'test',label:'Test', type:'text',  options:[], required:true};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation settings only when question type is number', () => {
    component.question.type = 'number';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#validation-div')).toBeTruthy();
    component.question.type = 'text';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#validation-div')).toBeFalsy();
    component.question.type = 'radio';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#validation-div')).toBeFalsy();
    component.question.type = 'checkbox';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#validation-div')).toBeFalsy();
    component.question.type = 'select';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#validation-div')).toBeFalsy();
  });

  it('should show options only when question type is radio or select', () => {
    component.question.type = 'number';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#options-div')).toBeFalsy();
    component.question.type = 'text';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#options-div')).toBeFalsy();
    component.question.type = 'radio';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#options-div')).toBeTruthy();
    component.question.type = 'checkbox';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#options-div')).toBeFalsy();
    component.question.type = 'select';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#options-div')).toBeTruthy();
  });
});
