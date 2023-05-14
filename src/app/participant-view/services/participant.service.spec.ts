import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ParticipantService } from './participant.service';
import { environment } from 'src/environments/environment';

describe('ParticipantService', () => {
  let service: ParticipantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ParticipantService]
    });
    service = TestBed.inject(ParticipantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getParticipant', () => {
    it('should make a GET request to the register/participant endpoint', () => {
      let id = 'testid';
      service.getParticipant(id).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/register/participant/${id}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('addResponses', () => {
    it('should make a PATCH request to the addResponses endpoint', () => {
      let participantId = 'testid';
      let responses = [{questionId: 'testid', response: 'testresponse'}];
      service.addResponses({participantId, responses}).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/addResponses`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({participantId, responses});
    });
  });

});
