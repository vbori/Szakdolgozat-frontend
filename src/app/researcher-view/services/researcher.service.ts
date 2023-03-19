import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResearcherService {

  constructor(private readonly http: HttpClient) {
  }

  public changePassword(params: any): Observable<any> { // any = { oldPassword: string, newPassword: string }
    let headers = new HttpHeaders();
    console.log(params);
    let options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
    };
    //headers.set('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
    //headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
    //headers.append('Content-Type', 'application/json');
    return this.http.patch(`${environment.baseUrl}/research/changePassword`, params, options);
  }
}
