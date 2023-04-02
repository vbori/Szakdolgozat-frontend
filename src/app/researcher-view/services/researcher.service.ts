import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExperimentExtract } from '../../common/models/experiment.model';

@Injectable({
  providedIn: 'root'
})
export class ResearcherService {

  constructor(private readonly http: HttpClient) {
  }

  public changePassword(params: any): Observable<any> { // any = { oldPassword: string, newPassword: string }
    let options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
    };

    return this.http.patch(`${environment.baseUrl}/research/changePassword`, params, options);
  }
}
