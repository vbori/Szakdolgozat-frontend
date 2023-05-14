import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ParticipantFormEditorComponent } from './participant-form-editor.component';

describe('ParticipantFormEditorComponent', () => {
  let component: ParticipantFormEditorComponent;
  let fixture: ComponentFixture<ParticipantFormEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantFormEditorComponent ],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ToastrService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantFormEditorComponent);
    component = fixture.componentInstance;
    component.experiment = undefined;
    component.isDirty = false;
    component.isQuestionValid = [true];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onQuestionChange', () => {
    it('should set the isDirty flag to true', () => {
      component.onQuestionChange();
      expect(component.isDirty).toBeTrue();
    });
  });

  describe('onValidityChange', () => {
    it('should set the proper element in the isQuestionValid array', () => {
      component.onValidityChange(0, true);
      expect(component.isQuestionValid[0]).toBeTrue();
    });
  });
});
