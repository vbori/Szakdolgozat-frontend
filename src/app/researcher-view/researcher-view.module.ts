import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ResearcherViewComponent } from './researcher-view.component';
import { AuthComponent, LoginComponent, RegisterComponent } from './auth';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ResearcherOverviewComponent, ExperimentListComponent, ExperimentCardComponent } from './researcher-overview';
import { ExperimentDetailsComponent, RoundsTableComponent } from './experiment-details';
import { CreateExperimentComponent, ExperimentBasicsComponent, ParticipantDescriptionEditorComponent, RoundCreationComponent, RoundsGeneratorComponent, ManualConfigurationComponent, FabricCanvasComponent, ShapeFormComponent, ParticipantFormEditorComponent, QuestionCreationComponent } from './create-experiment';
import { researchRoutes } from './researcher-view.routes';

import { MATERIAL_MODULES } from './material-index';
import { ExpandedCanvasComponent } from './experiment-details/rounds-table/expanded-canvas/expanded-canvas.component';

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
    ParticipantDescriptionEditorComponent,
    RoundCreationComponent,
    RoundsGeneratorComponent,
    ManualConfigurationComponent,
    ParticipantFormEditorComponent,
    QuestionCreationComponent,
    FabricCanvasComponent,
    ShapeFormComponent,
    ExpandedCanvasComponent
  ],
  imports: [
    CommonModule,
    MATERIAL_MODULES,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(researchRoutes)
  ]
})
export class ResearcherViewModule { }
