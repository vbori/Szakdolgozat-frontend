import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private readonly http: HttpClient) { }

  public saveImage(imageData: string, experimentId: string, participantId: string, roundIdx: number): Observable<string>   {
    let body = { imageData, experimentId, participantId, roundIdx}
    return this.http.post<string>(`${environment.baseUrl}/participant/saveImage`, body);
  }

  public saveResult(result: Result): Observable<string> {
    return this.http.post<string>(`${environment.baseUrl}/participant/addResult`, {result});
  }
}
