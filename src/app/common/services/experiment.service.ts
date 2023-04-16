import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experiment, ExperimentExtract } from '../models/experiment.model';
import { environment } from 'src/environments/environment';
import { Round } from '../models/round.model';
import { Form } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  constructor(private readonly http: HttpClient) { }

  getExperimentById(experimentId: string): Observable<Experiment> {
    let headers = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.get<Experiment>(`${environment.baseUrl}/research/getExperiment/${experimentId}`,{ headers });
  }

  public getExperimentsByStatus(status:string): Observable<ExperimentExtract[]> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.get<ExperimentExtract[]>(`${environment.baseUrl}/research?status=${status}`, { headers });
  }

  public createExperiment(params: any): Observable<any> { //TODO: type observables
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.post(`${environment.baseUrl}/research/addExperiment`, params, { headers });
  }

  public updateExperiment(body: any): Observable<any> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.patch(`${environment.baseUrl}/research/editExperiment`, body, { headers });
  }

  public openExperiment(experimentId: string): Observable<any> { //any is message, experiment, researcher
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.patch(`${environment.baseUrl}/research/openExperiment`, { experimentId: experimentId }, { headers });
  }

  public closeExperiment(experimentId: string): Observable<any> { //any is message, experiment, researcher
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.patch(`${environment.baseUrl}/research/closeExperiment`, { experimentId: experimentId }, { headers });
  }

  public getDescription(experimentId: string): Observable<string> {
    return this.http.get<string>(`${environment.baseUrl}/participant/getDescription/${experimentId}`);
  }

  public getRounds(experimentId: string): Observable<Round[]> {
    return this.http.get<Round[]>(`${environment.baseUrl}/participant/getRounds/${experimentId}`);
  }

  public getForm(experimentId: string): Observable<Form> {
    return this.http.get<Form>(`${environment.baseUrl}/participant/getForm/${experimentId}`);
  }
}
