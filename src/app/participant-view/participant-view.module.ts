import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantViewComponent } from './participant-view.component';
import { ExperimentComponent } from './experiment/experiment.component';

@NgModule({
  declarations: [
    ParticipantViewComponent,
    ExperimentComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ParticipantViewModule { }
