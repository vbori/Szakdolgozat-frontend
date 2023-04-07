import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-create-experiment',
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.scss']
})
export class CreateExperimentComponent {
  totalSteps = 4;
  stepCount = 0;
  experiment: Experiment | undefined
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private experimentService: ExperimentService) {
  }

  createExperiment(){
    this.stepCount++;
    console.log("Create Experiment")
  }

  onStepChange(event: any){ //TODO: type events
    this.stepCount = event.selectedIndex;
  }

  onExperimentChange(event: any){
    this.experiment = event.experiment;
    console.log("Experiment changed in main component");
    //console.log(this.experiment);
    console.log(this.stepper);
    this.stepper.next;
  }
}
