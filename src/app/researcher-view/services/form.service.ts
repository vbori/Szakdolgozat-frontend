import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Form, Question } from 'src/app/common/models/form.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private readonly http: HttpClient) { }

  public getForm(experimentId: string): Observable<Form> {
    let headers = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
    });
    return this.http.get<Form>(`${environment.baseUrl}/research/getForm?experimentId=${experimentId}`, { headers});
  }

  public addForm(experimentId: string, questions: Question[]): Observable<HttpResponse<{ message: string }>> {
    let options = {
      headers : new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
      observe: 'response' as const
    };

    let body = {experimentId, questions}
    return this.http.post<{ message: string }>(`${environment.baseUrl}/research/addForm`, body, options);
  }

  public updateForm(experimentId: string, questions: Question[]): Observable<HttpResponse<{ message: string }>> {
    let options = {
      headers : new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
      observe: 'response' as const
    };

    let body = {experimentId, questions}
    return this.http.patch<{ message: string }>(`${environment.baseUrl}/research/editForm`, body, options);
  }

  public deleteForm(experimentId: string): Observable<HttpResponse<{ message: string }>> {
    let options = {
      headers : new HttpHeaders({
        "Authorization": 'Bearer ' + localStorage.getItem('accessToken'),
      }),
      observe: 'response' as const
    };

    return this.http.delete<{ message: string }>(`${environment.baseUrl}/research/deleteForm?experimentId=${experimentId}`, options);
  }
}
