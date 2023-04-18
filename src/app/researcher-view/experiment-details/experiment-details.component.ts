import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
@Component({
  selector: 'app-experiment-details',
  templateUrl: './experiment-details.component.html',
  styleUrls: ['./experiment-details.component.scss']
})
export class ExperimentDetailsComponent implements OnInit {
  experiment: Experiment;

  constructor(private readonly route: ActivatedRoute,
              private readonly experimentService: ExperimentService,
              private readonly router: Router) {}

  ngOnInit(): void {
    this.experimentService.getExperimentById(this.route.snapshot.params['id']).subscribe({
      next: (experiment) => this.experiment = experiment,
      error: () => this.router.navigate(['/404'])
    });
  }

  //TODO: add open/close/edit experiment
  //TODO: add viewing demo of experiment
}
