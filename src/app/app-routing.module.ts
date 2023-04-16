import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantViewComponent } from './participant-view/participant-view.component';
import { AuthComponent } from './researcher-view/auth/auth.component';
import { AuthActivatorService } from './common/services/route-guards/auth-activator.service';
import { ResearcherActivatorService } from './common/services/route-guards/researcher-activator.service';
import { Error404Component } from './error404/error404.component';
import { ParticipantActivatorService } from './common/services/route-guards/participant-activator.service';
import { participantDeactivator } from './common/services/route-guards/participant-deactivator';
//TODO: clean up imports

const routes: Routes = [
  {
    path: 'research',
    canActivate:[ResearcherActivatorService],
    loadChildren: () => import('./researcher-view/researcher-view.module').then(m => m.ResearcherViewModule)
  },
  { path: 'login', component: AuthComponent, canActivate: [AuthActivatorService] },
  { path: 'register', component: AuthComponent, canActivate: [AuthActivatorService] },
  {
    path: 'participant/:experimentId',
    //canActivate: [ParticipantActivatorService],
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
