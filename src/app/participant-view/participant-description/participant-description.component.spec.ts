import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDescriptionComponent } from './participant-description.component';

describe('ParticipantDescriptionComponent', () => {
  let component: ParticipantDescriptionComponent;
  let fixture: ComponentFixture<ParticipantDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
