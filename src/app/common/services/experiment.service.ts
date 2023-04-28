import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Experiment, ExperimentExtract } from '../models/experiment.model';
import { environment } from 'src/environments/environment';
import { Form } from '../models/form.model';
import { Result } from '../models/result.model';
import { Round } from '../models/round.model';

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

  public createExperiment(name: string, researcherDescription: string, maxParticipantNum: number, controlGroupChance: number, cursorImageMode: string | undefined, positionTrackingFrequency: number | undefined): Observable<Experiment> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    let experimentBasics = {name, researcherDescription, maxParticipantNum, controlGroupChance, cursorImageMode, positionTrackingFrequency};

    return this.http.post<Experiment>(`${environment.baseUrl}/research/addExperiment`, experimentBasics, { headers });
  }

  public updateExperiment(updatedData: any): Observable<Experiment> { //TODO: type parameter?
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.patch<Experiment>(`${environment.baseUrl}/research/editExperiment`, updatedData, { headers });
  }

  public openExperiment(experimentId: string): Observable<{message: string, experiment: Experiment, activeExperimentCount: number}> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.patch<{message: string, experiment: Experiment, activeExperimentCount:number}>(`${environment.baseUrl}/research/openExperiment`, { experimentId: experimentId }, { headers });
  }

  public closeExperiment(experimentId: string): Observable<{message: string, experiment: Experiment, activeExperimentCount: number}> { //any is message, experiment, researcher
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.patch<{message: string, experiment: Experiment, activeExperimentCount: number}>(`${environment.baseUrl}/research/closeExperiment`, { experimentId: experimentId }, { headers });
  }

  public deleteExperiment(experimentId: string): Observable<{message: string}> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });

    return this.http.delete<{message: string}>(`${environment.baseUrl}/research/deleteExperiment/${experimentId}`, { headers });
  }
  
  public downloadExperiment(experimentId: string, format: 'json' | 'csv'): Observable<Blob> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      "responseType": "arraybuffer"
    });
  
    return this.http.get(`${environment.baseUrl}/research/downloadResults/${experimentId}/${format}`, { headers, responseType: 'arraybuffer' }).pipe(
      map((response: ArrayBuffer) => {
        return new Blob([response], { type: 'application/zip' });
      })
    );
  }

  public getDescription(experimentId: string, demoMode: boolean = false ): Observable<string> {
    return this.http.get<string>(`${environment.baseUrl}/participant/getDescription/${experimentId}/${demoMode}`);
  }

  public getRoundsAndTrackingInfo(experimentId: string): Observable<{rounds: Round[], cursorImageMode: string | undefined, positionTrackingFrequency: number | undefined}> {
    return this.http.get<{rounds: Round[], cursorImageMode: string | undefined, positionTrackingFrequency: number | undefined}>(`${environment.baseUrl}/participant/getRoundsAndTrackingInfo/${experimentId}`);
  }

  public getForm(experimentId: string): Observable<Form> {
    return this.http.get<Form>(`${environment.baseUrl}/participant/getForm/${experimentId}`);
  }

  public hasForm(experimentId: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.baseUrl}/participant/hasForm/${experimentId}`);
  }

  public saveImage(imageData: string, experimentId: string, participantId: string, roundIdx: number): Observable<any>   {
    let body = { imageData, experimentId, participantId, roundIdx}
    return this.http.post<any>(`${environment.baseUrl}/participant/saveImage`, body);
  }

  public saveResult(result: Result): Observable<string> {
    return this.http.post<string>(`${environment.baseUrl}/participant/addResult`, {result});
  }
}
