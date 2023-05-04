import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatStepperModule} from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ParticipantViewComponent } from './participant-view.component';

describe('ParticipantViewComponent', () => {
  let component: ParticipantViewComponent;
  let fixture: ComponentFixture<ParticipantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantViewComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatStepperModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params:{demoMode: 'Active'}}
          }
        },
        ToastrService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
