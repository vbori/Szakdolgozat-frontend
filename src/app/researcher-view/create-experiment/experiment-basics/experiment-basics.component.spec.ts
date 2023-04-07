import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentBasicsComponent } from './experiment-basics.component';

describe('ExperimentBasicsComponent', () => {
  let component: ExperimentBasicsComponent;
  let fixture: ComponentFixture<ExperimentBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentBasicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
