import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearcherViewComponent } from './researcher-view.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ResearcherOverviewComponent } from './researcher-overview/researcher-overview.component';
import { ExperimentListComponent } from './researcher-overview/experiment-list/experiment-list.component';
import { ExperimentCardComponent } from './researcher-overview/experiment-card/experiment-card.component';
import { MatCardModule } from '@angular/material/card';
import { ExperimentDetailsComponent } from './experiment-details/experiment-details.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { RoundsTableComponent } from './experiment-details/rounds-table/rounds-table.component';
import { CreateExperimentComponent } from './create-experiment/create-experiment.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStepperModule} from '@angular/material/stepper';
import { ExperimentBasicsComponent } from './create-experiment/experiment-basics/experiment-basics.component';
import { ParticipantDescriptionEditorComponent } from './create-experiment/participant-description-editor/participant-description-editor.component';
//TODO: Clean up imports

@NgModule({
  declarations: [
    ResearcherViewComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    PasswordChangeComponent,
    ResearcherOverviewComponent,
    ExperimentListComponent,
    ExperimentCardComponent,
    ExperimentDetailsComponent,
    RoundsTableComponent,
    CreateExperimentComponent,
    ExperimentBasicsComponent,
    ParticipantDescriptionEditorComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    RouterModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatProgressBarModule,
    MatStepperModule
  ]
})
export class ResearcherViewModule { }
