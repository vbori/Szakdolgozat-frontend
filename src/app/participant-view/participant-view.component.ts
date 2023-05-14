import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from './services/participant.service';
import { Participant } from './models/participant.model';
import { MatStepper } from '@angular/material/stepper';
import { ExperimentService } from '../common/services/experiment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-participant-view',
  templateUrl: './participant-view.component.html',
  styleUrls: ['./participant-view.component.scss']
})

export class ParticipantViewComponent implements OnInit{
  participant: Participant;
  finished = false;
  experimentId: string;
  demoMode = false;
  hasForm : boolean;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private readonly participantService: ParticipantService,
              private readonly experimentService: ExperimentService,
              private route: ActivatedRoute, private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      return true;
    };

    if(this.route.snapshot.params['demoMode']){
      this.demoMode = this.route.snapshot.params['demoMode'] === 'true';
    }

    this.experimentId = this.route.snapshot.params['experimentId'];

    if(this.demoMode){
      this.experimentService.getExperimentById(this.experimentId).subscribe({
        next: (experiment) => {
          if(experiment.rounds.length == 0){
            this.toastr.error('Experiment does not have rounds', 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
            this.router.navigate(['/research']);
            return;
          }else{
            this.hasForm = !!experiment.formId;
          }
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }else{
      this.experimentService.hasForm(this.experimentId).subscribe({
        next: (hasForm) => {
          this.hasForm = hasForm;
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }

    if(!this.demoMode){
      this.participantService.getParticipant(this.experimentId).subscribe({
        next: (participant) => {
          this.participant = participant;
        },
        error: () => {
          this.router.navigate(['/404'])
        }
      });
    }else{
      this.participant = {
        _id: "demo",
        experimentId: this.experimentId,
        inControlGroup: false,
        responses: []
      }
    }
  }

  onNextStep(): void{
    if(this.stepper.selected) this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onFinish(): void{
    this.finished = true;
    if(this.stepper.selected) this.stepper.selected.completed = true;
    this.stepper.next();
  }
}
