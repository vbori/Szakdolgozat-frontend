import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

describe('ExperimentDetailsComponent', () => {
  let component: ExperimentDetailsComponent;
  let fixture: ComponentFixture<ExperimentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentDetailsComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatDividerModule,
        MatListModule,
        RouterLink
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params : {id: '1'}}
          }
        },
        ToastrService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentDetailsComponent);
    component = fixture.componentInstance;
    component.experiment = {
      _id: '1',
      name: 'Test Experiment',
      researcherDescription: 'Test Description',
      participantDescription: 'Test Description',
      status: 'Active',
      participantNum: 0,
      maxParticipantNum: 10,
      controlGroupChance: 0,
      rounds: []
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
