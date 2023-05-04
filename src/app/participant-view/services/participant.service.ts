import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Participant } from '../models/participant.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private readonly http: HttpClient) { }

  public getParticipant(id: string): Observable<Participant> {
    return this.http.get<Participant>(`${environment.baseUrl}/register/participant/${id}`);
  }

  public addResponses(body: unknown): Observable<string> {
    return this.http.patch<string>(`${environment.baseUrl}/participant/addResponses`, body);
  }
}
