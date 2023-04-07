import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  //TODO: type params
  public login(params: any): Observable<any> { // any = { username: string, password: string }
      return this.http.post(`${environment.baseAuthUrl}/login`, params).pipe(
        tap((response: any) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this._isLoggedIn$.next(true);
        })
      );
  }

  public register(params: any): Observable<any> { // any = { username: string, password: string }
    return this.http.post(`${environment.baseUrl}/register/researcher`, params);
  }

  public logout(): Observable<any> {
    console.log('logout');
    return this.http.delete(`${environment.baseAuthUrl}/logout?token=${localStorage.getItem('refreshToken')}`).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this._isLoggedIn$.next(false);
      })
    );
  }

  //TODO: add access token refresh logic, remove old tokens from local storage

}
