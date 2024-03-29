import { CreateExperimentComponent } from "./create-experiment/create-experiment.component";
import { ExperimentDetailsComponent } from "./experiment-details/experiment-details.component";
import { PasswordChangeComponent } from "./password-change/password-change.component";
import { ResearcherOverviewComponent } from "./researcher-overview/researcher-overview.component";
import { creationDeactivator } from "./services/creation-deactivator";

export const researchRoutes = [
  { path: 'dashboard', component: ResearcherOverviewComponent },
  { path: 'password',  component: PasswordChangeComponent},
  { path: 'experiment',
    children: [
      { path: 'details/:id', component: ExperimentDetailsComponent},
      {
        path: 'create/:id',
        component: CreateExperimentComponent,
        canDeactivate: [creationDeactivator]},
      {
        path: 'create',
        component: CreateExperimentComponent,
        canDeactivate: [creationDeactivator]
      },
      { path: '**', redirectTo: '/research/dashboard'}
    ]
  },
  { path: '**', redirectTo: '/research/dashboard'}
]
