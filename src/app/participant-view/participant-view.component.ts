import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from './services/participant.service';
import { Participant } from './models/participant.model';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-participant-view',
  templateUrl: './participant-view.component.html',
  styleUrls: ['./participant-view.component.scss']
})

export class ParticipantViewComponent implements OnInit{
  participant: Participant;
  finished = false;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private readonly participantService: ParticipantService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      return true;
    };

    this.participantService.getParticipant(this.route.snapshot.params['experimentId']).subscribe({
      next: (participant) => {
        this.participant = participant;
      },
      error: () => {
        this.router.navigate(['/404'])
      }
    });
  }

  onNextStep(){
    if(this.stepper.selected) this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onFinish(){
    this.finished = true;
    if(this.stepper.selected) this.stepper.selected.completed = true;
    this.stepper.next();
  }
}
