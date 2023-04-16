import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResearcherViewModule } from './researcher-view/researcher-view.module';
import { ParticipantViewModule } from './participant-view/participant-view.module';
import { NavbarComponent } from './navbar/navbar.component';
import { Error404Component } from './error404/error404.component';

//TODO: clean up imports

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
    ParticipantViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
