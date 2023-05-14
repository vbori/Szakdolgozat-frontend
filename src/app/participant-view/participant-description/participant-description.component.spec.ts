import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ParticipantDescriptionComponent } from './participant-description.component';

describe('ParticipantDescriptionComponent', () => {
  let component: ParticipantDescriptionComponent;
  let fixture: ComponentFixture<ParticipantDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDescriptionComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('"Next" button should be disabled when the conditions are not accepted', () => {
    component.participantDescriptionForm.controls['conditionsCheckbox'].setValue(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#next-btn').disabled).toBeTruthy();
    expect(component.participantDescriptionForm.valid).toBeFalsy();
  });

  it('"Next" button should be disabled when the flash warning is not accepted', () => {
    component.participantDescriptionForm.controls['flashWarningCheckbox'].setValue(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#next-btn').disabled).toBeTruthy();
    expect(component.participantDescriptionForm.valid).toBeFalsy();
  });

  it('"Next" button should be enabled when the conditions and flash warning are accepted', () => {
    component.participantDescriptionForm.controls['conditionsCheckbox'].setValue(true);
    component.participantDescriptionForm.controls['flashWarningCheckbox'].setValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#next-btn').disabled).toBeFalsy();
    expect(component.participantDescriptionForm.valid).toBeTruthy();
  });
});
