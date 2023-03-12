import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantViewComponent } from './participant-view/participant-view.component';
import { AuthComponent } from './researcher-view/auth/auth.component';
import { ResearcherViewComponent } from './researcher-view/researcher-view.component';

const routes: Routes = [
  { path: 'dashboard', component: ResearcherViewComponent },
  { path: 'experiment', component: ParticipantViewComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
