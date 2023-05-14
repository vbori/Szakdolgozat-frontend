import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ExperimentComponent } from './experiment.component';

describe('ExperimentComponent', () => {
  let component: ExperimentComponent;
  let fixture: ComponentFixture<ExperimentComponent>;
  let rounds = [{objects: [], canvasHeight:600,  canvasWidth:800, background:'#ffffff'}];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentComponent ],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentComponent);
    component = fixture.componentInstance;
    component.rounds = rounds;
    component.experimentId = '1';
    component.demoMode = false;
    component.participantId = '1';
    component.controlMode = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create main canvas', () => {
    expect(component.mainCanvas).toBeTruthy();
  });

  it('should set canvas width and height', () => {
    component.loadMainCanvas(rounds[0]);
    expect(component.mainCanvas.width).toEqual(800);
    expect(component.mainCanvas.height).toEqual(600);
  });
});
