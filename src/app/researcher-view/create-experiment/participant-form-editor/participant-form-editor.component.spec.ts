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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
