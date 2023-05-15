import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  experiment: Experiment | undefined = undefined;
  experimentChecked: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private experimentService: ExperimentService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly toastr: ToastrService) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id'] != undefined){
      this.experimentService.getExperimentById(this.route.snapshot.params['id']).subscribe({
        next: (experiment) => {
          if(experiment.status != 'Draft'){
            this.toastr.error('Experiment is not in draft mode', 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
            this.router.navigate(['/research']);
            return;
          }else{
            this.experiment = experiment;
            this.experimentChecked = true;
            window.onbeforeunload = (event) => {
              event.preventDefault();
              event.returnValue = '';
              return true;
            };
          }
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
          this.router.navigate(['/research']);
        }
      });
    }else{
      this.experimentChecked = true;
    }
  }

  createExperiment(): void{
    this.stepCount++;
  }

  onStepChange(event: StepperSelectionEvent): void{
    this.stepCount = event.selectedIndex;
  }

  onExperimentChange(event: Experiment): void{
    this.experiment = event;

    if(this.stepper.selected) this.stepper.selected.completed = true;
  }

  onNextStep(): void{
    this.stepper.next();
  }
}
