import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experiment, ExperimentExtract } from '../models/experiment.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  constructor(private readonly http: HttpClient) { }

  getExperimentById(id: string): Observable<Experiment> {
    let headers = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      })
    return this.http.get<Experiment>(`${environment.baseUrl}/research/getExperiment/${id}`,{ headers });
  }

  public getExperimentsByStatus(status:string): Observable<ExperimentExtract[]> {
    let options = {
      headers: new HttpHeaders({
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
    };

    return this.http.get<ExperimentExtract[]>(`${environment.baseUrl}/research?status=${status}`, options);
  }
}
