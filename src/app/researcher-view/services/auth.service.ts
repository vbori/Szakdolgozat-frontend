import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResearcherCredentials, ResearcherToken } from '../models/researcher-credentials.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    const token = localStorage.getItem('accessToken');
    this._isLoggedIn$.next(!!token);
    if(localStorage.getItem('accessToken')){
      this.startRefreshTokenTimer();
    }
  }

  public login(credentials: ResearcherCredentials): Observable<ResearcherToken> {
    return this.http.post(`${environment.baseUrl}/auth/login`, credentials, {withCredentials: true}).pipe(
      tap((token: any) => {
        localStorage.setItem('accessToken', token.accessToken);
        this.startRefreshTokenTimer();
        this._isLoggedIn$.next(true);
      })
    );
  }

  public register(credentials: ResearcherCredentials): Observable<HttpResponse<{ message: string }>> {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/register/researcher`, credentials, { observe: 'response' });
  }

  public logout(): Observable<HttpResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`${environment.baseUrl}/auth/logout`, { observe: 'response', withCredentials: true}).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        this.stopRefreshTokenTimer();
        this._isLoggedIn$.next(false);
      })
    );
  }

  private refreshTokenTimeout?:  ReturnType<typeof setTimeout>;

  refreshToken() {
    return this.http.post<any>(`${environment.baseUrl}/auth/token`, {}, { withCredentials: true })
      .pipe(map((token) => {
        localStorage.setItem('accessToken', token.accessToken);
        this.startRefreshTokenTimer();
      }),
      catchError(() => {
        this.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
        return of(null);
      }));
  }

  private startRefreshTokenTimer() {
    const jwtBase64 = localStorage.getItem('accessToken')?.split('.')[1];
    const jwtToken = jwtBase64 ? JSON.parse(window.atob(jwtBase64)) : undefined;

    // set a timeout to refresh the token a minute before it expires
    const timeout = jwtToken.exp*1000 - Date.now();
    console.log(timeout);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout > 60*1000 ? timeout - 60*1000 : timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
