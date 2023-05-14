import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExperimentBasicsComponent } from './experiment-basics.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExperimentBasicsComponent', () => {
  let component: ExperimentBasicsComponent;
  let fixture: ComponentFixture<ExperimentBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentBasicsComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('form should be invalid when experiment name is missing', () => {
    component.experimentBasicsForm.controls['name'].setValue('');
    expect(component.experimentBasicsForm.controls['name'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  it ('form should be invalid when experiment description is missing', () => {
    component.experimentBasicsForm.controls['researcherDescription'].setValue('');
    expect(component.experimentBasicsForm.controls['researcherDescription'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  it ('form should be invalid when maximum number of participants is missing', () => {
    component.experimentBasicsForm.controls['maxParticipantNum'].setValue(null);
    expect(component.experimentBasicsForm.controls['maxParticipantNum'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  it ('form should be invalid when maximum number of participants is less than 1', () => {
    component.experimentBasicsForm.controls['maxParticipantNum'].setValue(0);
    expect(component.experimentBasicsForm.controls['maxParticipantNum'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  it ('form should be invalid when control group chance is missing', () => {
    component.experimentBasicsForm.controls['controlGroupChance'].setValue(null);
    expect(component.experimentBasicsForm.controls['controlGroupChance'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  it ('form should be invalid when control group chance is less than 0', () => {
    component.experimentBasicsForm.controls['controlGroupChance'].setValue(-1);
    expect(component.experimentBasicsForm.controls['controlGroupChance'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  it ('form should be invalid when control group chance is greater than 100', () => {
    component.experimentBasicsForm.controls['controlGroupChance'].setValue(101);
    expect(component.experimentBasicsForm.controls['controlGroupChance'].valid).toBeFalsy();
    expect(component.experimentBasicsForm.valid).toBeFalsy();
  });

  describe('Position tracking is needed', () => {
    beforeEach(() => {
      component.experimentBasicsForm.controls['positionArrayNeeded'].setValue(true);
      fixture.detectChanges();
    });

    it ('form should be invalid when position tracking frequency is missing', () => {
      component.experimentBasicsForm.controls['positionTrackingFrequency'].setValue(null);
      expect(component.experimentBasicsForm.controls['positionTrackingFrequency'].valid).toBeFalsy();
      expect(component.experimentBasicsForm.valid).toBeFalsy();
    });

    it ('position tracking frequency is enabled', () => {
      expect(component.experimentBasicsForm.controls['positionTrackingFrequency'].enabled).toBeTruthy();
    });

    it('should show position tracking frequency field', () => {
      expect(fixture.nativeElement.querySelector('#position-freq')).toBeTruthy();
    });
  });

  describe('Position tracking is not needed', () => {
    beforeEach(() => {
      component.experimentBasicsForm.controls['positionArrayNeeded'].setValue(false);
      fixture.detectChanges();
    });

    it ('position tracking frequency is disabled', () => {
      expect(component.experimentBasicsForm.controls['positionTrackingFrequency'].enabled).toBeFalsy();
    });

    it('should not show position tracking frequency field', () => {
      expect(fixture.nativeElement.querySelector('#position-freq')).toBeFalsy();
    });
  });

  describe('cursor path image is neeeded', () => {
    beforeEach(() => {
      component.experimentBasicsForm.controls['cursorPathImageNeeded'].setValue(true);
      fixture.detectChanges();
    });

    it ('should show image settings', () => {
      expect(fixture.nativeElement.querySelector('#image-settings').hidden).toBeFalsy();
    });
  });

  describe('cursor path image is not neeeded', () => {
    beforeEach(() => {
      component.experimentBasicsForm.controls['cursorPathImageNeeded'].setValue(false);
      fixture.detectChanges();
    });

    it ('should not show image settings', () => {
      expect(fixture.nativeElement.querySelector('#image-settings').hidden).toBeTruthy();
    });
  });

});
