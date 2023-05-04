import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ExperimentComponent } from './experiment.component';

describe('ExperimentComponent', () => {
  let component: ExperimentComponent;
  let fixture: ComponentFixture<ExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentComponent ],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
