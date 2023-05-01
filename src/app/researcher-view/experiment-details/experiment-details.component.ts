import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
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
      next: (experiment) => {
        this.experiment = experiment;
        this.formatDates();
      },

      error: () => this.router.navigate(['/404'])
    });
  }

  closeExperiment(): void {
    this.experimentService.closeExperiment(this.experiment._id).subscribe({
      next: (response) => {
        this.experiment = response.experiment;
        this.formatDates();
      },//TODO: display messages
      error: (error) => console.log(error)
    });
  }

  openExperiment(): void {
    this.experimentService.openExperiment(this.experiment._id).subscribe({
      next: (response) => {
        this.experiment = response.experiment;
        this.formatDates();
      }, //TODO: display messages
      error: (error) => console.log(error)
    });
  }

  deleteExperiment(): void {
    this.experimentService.deleteExperiment(this.experiment._id).subscribe({
      next: () => this.router.navigate(['/research']),
      error: (error) => console.log(error) //TODO: display messages
    });
  }

  formatDates(): void {
    this.experiment.closedAt = this.experiment.closedAt?.split('T')[0];
    this.experiment.openedAt = this.experiment.openedAt?.split('T')[0];
  }

  shareExperiment(): void {
    const url = `${environment.frontendBaseUrl}/participant/${this.experiment._id}`;
    navigator.clipboard.writeText(url).then(() => {
      console.log('URL copied to clipboard'); //TODO: display messages
    }).catch((error) => {
      console.log(error);
    });
  }

  downloadExperiment(format: 'json' | 'csv'): void {
    this.experimentService.downloadExperiment(this.experiment._id, format).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/zip' });
        saveAs(blob, `experiment-${this.experiment._id}.zip`);
      },
      error: (error) => console.log(error) // TODO: display messages
    });
  }
}