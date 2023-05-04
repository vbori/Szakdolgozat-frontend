import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { CreateExperimentComponent } from './create-experiment.component';

describe('CreateExperimentComponent', () => {
  let component: CreateExperimentComponent;
  let fixture: ComponentFixture<CreateExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExperimentComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params:{ id: '1'}}
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
