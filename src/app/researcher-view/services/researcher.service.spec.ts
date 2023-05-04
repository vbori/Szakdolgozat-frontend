import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ResearcherService } from './researcher.service';
import { PasswordChangeCredentials } from '../models/password-change-credentials.model';
import { environment } from 'src/environments/environment';

describe('ResearcherService', () => {
  let service: ResearcherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResearcherService]
    });
    service = TestBed.inject(ResearcherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a PATCH request to the API endpoint', () => {
    const credentials: PasswordChangeCredentials = { oldPassword: 'old', newPassword: 'new' };
    service.changePassword(credentials).subscribe(response => {
      expect(response.status).toEqual(200);
      if (response.body) expect(response.body.message).toEqual('Password changed successfully');
    });

    const request = httpMock.expectOne(`${environment.baseUrl}/research/changePassword`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(credentials);
    expect(request.request.headers.has('Content-Type')).toBeTrue();
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.headers.has('Authorization')).toBeTrue();
    expect(request.request.headers.get('Authorization')).toEqual('Bearer ' + localStorage.getItem('accessToken'));
    request.flush({ message: 'Password changed successfully' });
  });

});
