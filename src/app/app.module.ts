import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResearcherViewModule } from './researcher-view/researcher-view.module';
import { ParticipantViewModule } from './participant-view/participant-view.module';
import { NavbarComponent } from './common/navbar/navbar.component';
import { Error404Component } from './common/error404/error404.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ResearcherViewModule,
    ParticipantViewModule,
    MatIconModule,
    MatButtonModule,
    ToastrModule.forRoot()
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
