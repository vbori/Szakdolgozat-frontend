import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  participantId: FormControl = new FormControl('', [Validators.required]);
  @Output() nextStep = new EventEmitter();

  checkId() {
    console.log(this.participantId.value);
    this.nextStep.emit();
  }
}
