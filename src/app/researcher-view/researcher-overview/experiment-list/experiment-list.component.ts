import { Component, Input, OnInit } from '@angular/core';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentExtract, ExperimentStatus } from '../../../common/models/experiment.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-experiment-list',
  templateUrl: './experiment-list.component.html',
  styleUrls: ['./experiment-list.component.scss']
})

export class ExperimentListComponent implements OnInit{

  @Input() experimentStatus: ExperimentStatus;
  experiments: ExperimentExtract[] = [];

  constructor(private readonly experimentService: ExperimentService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.experimentService.getExperimentsByStatus(this.experimentStatus).subscribe({
      next: (experiments) => {
        this.experiments  = experiments;
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }
}
