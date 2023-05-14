import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantViewComponent } from './participant-view/participant-view.component';
import { AuthComponent } from './researcher-view/auth/auth.component';
import { AuthActivatorService, ResearcherActivatorService} from './common/services/route-guards';
import { participantDeactivator } from './participant-view/services/participant-deactivator';
import { Error404Component } from './common/error404/error404.component';

const routes: Routes = [
  {
    path: 'research',
    canActivate:[ResearcherActivatorService],
    loadChildren: () => import('./researcher-view/researcher-view.module').then(m => m.ResearcherViewModule)
  },
  { path: 'login', component: AuthComponent, canActivate: [AuthActivatorService] },
  { path: 'register', component: AuthComponent, canActivate: [AuthActivatorService] },
  {
    path: 'participant/:experimentId/:demoMode',
    canActivate: [ResearcherActivatorService],
    component: ParticipantViewComponent
  },
  {
    path: 'participant/:experimentId',
    canDeactivate: [participantDeactivator],
    component: ParticipantViewComponent
  },
  { path: '404', component: Error404Component },
  { path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
