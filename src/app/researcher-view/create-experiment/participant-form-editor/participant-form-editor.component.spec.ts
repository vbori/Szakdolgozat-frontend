import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantFormEditorComponent } from './participant-form-editor.component';

describe('ParticipantFormEditorComponent', () => {
  let component: ParticipantFormEditorComponent;
  let fixture: ComponentFixture<ParticipantFormEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantFormEditorComponent ]
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
