import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { ParticipantViewComponent } from './participant-view.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { ParticipantDescriptionComponent } from './participant-description/participant-description.component';
import { ExperimentService } from '../common/services/experiment.service';
import { BrowserModule } from '@angular/platform-browser';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
//import { participantRoutes } from './participant-view.routes';

@NgModule({
  declarations: [
    ParticipantViewComponent,
    ExperimentComponent,
    ParticipantFormComponent,
    ParticipantDescriptionComponent,
    ThankYouPageComponent
  ],
  imports: [
    //CommonModule,
    BrowserModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    //RouterModule.forChild(participantRoutes),
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [
    ExperimentService
  ]
})
export class ParticipantViewModule { }
