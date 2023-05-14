import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ResultService } from './result.service';
import { environment } from 'src/environments/environment';

describe('ResultService', () => {
  let service: ResultService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResultService]
    });
    service = TestBed.inject(ResultService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveImage', () => {
    it('should make a POST request to the saveImage endpoint', () => {
    service.saveImage('test', 'testid', 'testid2', 1).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/saveImage`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({imageData: 'test', participantId: 'testid2', experimentId: 'testid', roundIdx: 1});
    });
  });

  describe('saveResult', () => {
    it('should make a POST request to the addResult endpoint', () => {
      let result = {
        experimentId: 'testid',
        participantId: 'testid2',
        roundIdx: 0,
        roundId: 'testid3',
        clicks: [],
        misclickCount: 0,
        timeNeeded: 300
      }
      service.saveResult(result).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/addResult`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({result});
    });
  });
});
