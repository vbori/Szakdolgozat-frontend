import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ExperimentCardComponent } from './experiment-card.component';

describe('ExperimentCardComponent', () => {
  let component: ExperimentCardComponent;
  let fixture: ComponentFixture<ExperimentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentCardComponent ],
      imports: [MatCardModule, RouterLink],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {demoMode: 'Active'}}
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentCardComponent);
    component = fixture.componentInstance;
    component.experiment = {_id: '01', name: 'Test', researcherDescription: 'Test', status: 'Active', participantNum: 0 }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create card', () => {
    expect(fixture.nativeElement.querySelector('mat-card')).toBeTruthy();
  });
});
