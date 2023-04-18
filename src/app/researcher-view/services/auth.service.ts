import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResearcherCredentials, ResearcherTokens } from '../models/researcher-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private readonly http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    this._isLoggedIn$.next(!!token);
  }

  public login(credentials: ResearcherCredentials): Observable<ResearcherTokens> {
      return this.http.post(`${environment.baseAuthUrl}/login`, credentials).pipe(
        tap((tokens: any) => {
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          this._isLoggedIn$.next(true);
        })
      );
  }

  public register(credentials: ResearcherCredentials): Observable<HttpResponse<{ message: string }>> {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/register/researcher`, credentials, { observe: 'response' });
  }

  public logout(): Observable<HttpResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`${environment.baseAuthUrl}/logout?token=${localStorage.getItem('refreshToken')}`, { observe: 'response'}).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this._isLoggedIn$.next(false);
      })
    );
  }

  //TODO: add access token refresh logic, remove old tokens from local storage

}
