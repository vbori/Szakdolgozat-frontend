import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-create-experiment',
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.scss']
})
export class CreateExperimentComponent implements OnInit{
  totalSteps = 4;
  stepCount = 0;
  experiment: Experiment | undefined;
  experimentChecked: boolean;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private experimentService: ExperimentService, private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id'] != undefined){
      this.experimentService.getExperimentById(this.route.snapshot.params['id']).subscribe({
        next: (experiment) => {
          this.experiment = experiment;
          this.experimentChecked = true;
          console.log("Experiment loaded in main component");
          console.log(this.experiment);
        },
        error: () => console.log("Error loading experiment")
      });
    }else{
      this.experimentChecked = true;
    }
  }

  createExperiment(){
    this.stepCount++;
    console.log("Create Experiment")
  }

  onStepChange(event: any){ //TODO: type events
    this.stepCount = event.selectedIndex;
  }

  onExperimentChange(event: Experiment){
    console.log(event);
    this.experiment = event;
    console.log("Experiment changed in main component");
    console.log(this.experiment);

    if(this.stepper.selected) this.stepper.selected.completed = true;
  }

  onNextStep(){
    this.stepper.next();
  }
}
