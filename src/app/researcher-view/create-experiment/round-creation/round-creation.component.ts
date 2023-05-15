import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Experiment } from 'src/app/common/models/experiment.model';

@Component({
  selector: 'app-round-creation',
  templateUrl: './round-creation.component.html',
  styleUrls: ['./round-creation.component.scss']
})
export class RoundCreationComponent {
  @Input() experiment: Experiment | undefined = undefined;
  @Output() experimentChange = new EventEmitter<Experiment>();
  selectedTabIndex = 0;

  constructor() { }

  onExperimentChange(experiment: Experiment): void{
    this.experiment = experiment;
    this.experimentChange.emit(this.experiment);
  }
}
