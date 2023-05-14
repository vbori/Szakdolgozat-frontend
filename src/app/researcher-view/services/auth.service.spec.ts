import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ResearcherActivatorService } from 'src/app/common/services/route-guards';
import { ResearcherCredentials } from '../models/researcher-credentials.model';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('register', () => {
    it('should make a POST request to the register endpoint', () => {
      const credentials: ResearcherCredentials = { username: 'testuser', password: 'testpassword' };

      service.register(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/register/researcher`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
    });

  });

  /*describe('login', () => {
    it('should make a POST request to the login endpoint and store the access token in localStorage', () => {
      const credentials: ResearcherCredentials = { username: 'testuser', password: 'testpassword' };

      service.login(credentials).subscribe(token => {
        expect(localStorage.getItem('accessToken')).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(credentials);
    });
  });*/

  describe('logout', () => {
    it('should make a DELETE request to the logout endpoint and remove the access token from localStorage', () => {

      service.logout().subscribe(res => {
        expect(localStorage.getItem('accessToken')).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/auth/logout`);
      expect(req.request.method).toEqual('DELETE');
    });
  });
});
