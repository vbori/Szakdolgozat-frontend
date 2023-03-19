import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentCardComponent } from './experiment-card.component';

describe('ExperimentCardComponent', () => {
  let component: ExperimentCardComponent;
  let fixture: ComponentFixture<ExperimentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
