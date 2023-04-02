import { Component, Input, OnInit } from '@angular/core';
import { ExperimentExtract } from '../../../common/models/experiment.model';

@Component({
  selector: 'app-experiment-card',
  templateUrl: './experiment-card.component.html',
  styleUrls: ['./experiment-card.component.scss']
})
export class ExperimentCardComponent{
  @Input() experiment: ExperimentExtract;

}
