import { Component } from '@angular/core';
import { ResearcherService } from '../services/researcher.service';

@Component({
  selector: 'app-researcher-overview',
  templateUrl: './researcher-overview.component.html',
  styleUrls: ['./researcher-overview.component.scss']
})
export class ResearcherOverviewComponent {

  constructor(private readonly researcherService: ResearcherService) { }

  createExperiment(): void {
    console.log("Create experiment");
  }
}
