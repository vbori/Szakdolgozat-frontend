import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatTabsModule} from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RoundCreationComponent } from './round-creation.component';
import { Experiment, ExperimentStatus } from 'src/app/common/models/experiment.model';
import { EventEmitter } from '@angular/core';

describe('RoundCreationComponent', () => {
  let component: RoundCreationComponent;
  let fixture: ComponentFixture<RoundCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundCreationComponent ],
      imports: [MatTabsModule, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit experimentChange event on onExperimentChange', () => {
    const experiment: Experiment = {
      _id: '1',
      name: 'test',
      researcherDescription: 'test',
      participantDescription: 'test',
      rounds: [],
      maxParticipantNum: 10,
      participantNum: 5,
      controlGroupChance: 30,
      status: 'Draft' as ExperimentStatus
    };
    const emitter = spyOn(component.experimentChange, 'emit');
    component.onExperimentChange(experiment);
    expect(component.experiment).toEqual(experiment);
    expect(emitter).toHaveBeenCalledWith(experiment);
  });
});
