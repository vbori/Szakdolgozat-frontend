import { Component, Input, OnInit } from '@angular/core';
import { ExperimentExtract, ExperimentStatus } from '../../models/experiment.model';
import { ResearcherService } from '../../services/researcher.service';

@Component({
  selector: 'app-experiment-list',
  templateUrl: './experiment-list.component.html',
  styleUrls: ['./experiment-list.component.scss']
})

export class ExperimentListComponent implements OnInit{

  @Input() experimentStatus: ExperimentStatus;
  experiments: ExperimentExtract[];

  constructor(private readonly researcherService: ResearcherService) {
  }

  ngOnInit() {
    this.researcherService.getExperimentsByStatus(this.experimentStatus).subscribe({
      next: (experiments) => {
        this.experiments  = experiments;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
