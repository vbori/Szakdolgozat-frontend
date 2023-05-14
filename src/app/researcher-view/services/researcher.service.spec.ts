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

  it('should make a PATCH request to the changePassword endpoint', () => {
    const credentials: PasswordChangeCredentials = { oldPassword: 'oldPassword', newPassword: 'newPassword' };
    service.changePassword(credentials).subscribe();

    const request = httpMock.expectOne(`${environment.baseUrl}/research/changePassword`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(credentials);
  });

});
