import { Component, Input, OnInit } from '@angular/core';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentExtract, ExperimentStatus } from '../../../common/models/experiment.model';

@Component({
  selector: 'app-experiment-list',
  templateUrl: './experiment-list.component.html',
  styleUrls: ['./experiment-list.component.scss']
})

export class ExperimentListComponent implements OnInit{

  @Input() experimentStatus: ExperimentStatus;
  experiments: ExperimentExtract[];

  constructor(private readonly experimentService: ExperimentService) {
  }

  ngOnInit() {
    this.experimentService.getExperimentsByStatus(this.experimentStatus).subscribe({
      next: (experiments) => {
        this.experiments  = experiments;
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
  }
}
