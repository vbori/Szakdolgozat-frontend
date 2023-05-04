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
});
