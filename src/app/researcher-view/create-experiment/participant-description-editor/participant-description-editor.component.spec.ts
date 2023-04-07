import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDescriptionEditorComponent } from './participant-description-editor.component';

describe('ParticipantDescriptionEditorComponent', () => {
  let component: ParticipantDescriptionEditorComponent;
  let fixture: ComponentFixture<ParticipantDescriptionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDescriptionEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDescriptionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
