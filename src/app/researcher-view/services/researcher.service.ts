import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PasswordChangeCredentials } from '../models/password-change-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class ResearcherService {

  constructor(private readonly http: HttpClient) {
  }

  public changePassword(credentials: PasswordChangeCredentials): Observable<HttpResponse<{ message: string }>> {
    let options = {
      headers : new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
      observe: 'response' as const
    };

    return this.http.patch<{ message: string }>(`${environment.baseUrl}/research/changePassword`, credentials, options);
  }
}
