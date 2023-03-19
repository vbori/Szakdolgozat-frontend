import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantViewComponent } from './participant-view/participant-view.component';
import { AuthComponent } from './researcher-view/auth/auth.component';
import { PasswordChangeComponent } from './researcher-view/password-change/password-change.component';
import { ResearcherViewComponent } from './researcher-view/researcher-view.component';
import { AuthActivatorService } from './common/services/route-guards/auth-activator.service';
import { ResearcherActivatorService } from './common/services/route-guards/researcher-activator.service';
import { ResearcherOverviewComponent } from './researcher-view/researcher-overview/researcher-overview.component';

const routes: Routes = [
  {
    path: 'research',
    canActivate:[ResearcherActivatorService],
    children: [
      { path: 'dashboard', component: ResearcherOverviewComponent },
      { path: 'password',  component: PasswordChangeComponent},
      { path: '**', redirectTo: '/research/dashboard', pathMatch: 'full'}
    ]
  },
  { path: 'experiment', component: ParticipantViewComponent },
  { path: 'login', component: AuthComponent, canActivate: [AuthActivatorService] },
  { path: 'register', component: AuthComponent, canActivate: [AuthActivatorService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
