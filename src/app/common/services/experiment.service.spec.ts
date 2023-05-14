import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExperimentService } from './experiment.service';
import { Experiment } from '../models/experiment.model';
import { environment } from 'src/environments/environment';

describe('ExperimentService', () => {
  let service: ExperimentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExperimentService]
    });
    service = TestBed.inject(ExperimentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExperimentById', () => {
    it('should make a GET request to the getExperiment endpoint', () => {
      const experimentId = '1';

      service.getExperimentById(experimentId).subscribe((experiment) => {
        expect(experiment).toEqual(experiment);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/research/getExperiment/${experimentId}`);
      expect(req.request.method).toEqual('GET');
      expect(req.request.body).toBeNull();
    });
  });

  describe('getExperimentsByStatus', () => {
    it('should make a GET request to the research endpoint', () => {
      const status = 'Active';

      service.getExperimentsByStatus(status).subscribe((experiments) => {
        expect(experiments).toEqual(experiments);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/research?status=${status}`);
      expect(req.request.method).toEqual('GET');
      expect(req.request.body).toBeNull();
    });
  });

  describe('createExperiment', () => {
    it('should send a POST request with the experiment basics in the request body', () => {
      const name = 'Test experiment';
      const researcherDescription = 'This is a test experiment';
      const maxParticipantNum = 100;
      const controlGroupChance = 0.5;
      const cursorImageMode = 'hidden';
      const positionTrackingFrequency = 1000;

      service
        .createExperiment(name, researcherDescription, maxParticipantNum, controlGroupChance, cursorImageMode, positionTrackingFrequency)
        .subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}/research/addExperiment`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        name,
        researcherDescription,
        maxParticipantNum,
        controlGroupChance,
        cursorImageMode,
        positionTrackingFrequency,
      });
    });
  });

  describe('updateExperiment', () => {
    it('should send a PATCH request with the experiment basics in the request body', () => {
      let experimentId = '1';
      let updatedData = {
        name: 'Test experiment'
      };

      service.updateExperiment({experimentId, updatedData}).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/editExperiment`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual({
        experimentId,
        updatedData
      });
    });
  });

  describe('openExperiment', () => {
    it('should send a PATCH request with the experiment id in the request body', () => {
      let experimentId = '1';

      service.openExperiment(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/openExperiment`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual({
        experimentId
      });
    });
  });

  describe('closeExperiment', () => {
    it('should send a PATCH request with the experiment id in the request body', () => {
      let experimentId = '1';

      service.closeExperiment(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/closeExperiment`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual({
        experimentId
      });
    });
  });

  describe('deleteExperiment', () => {
    it('should send a DELETE request to the deleteExperiment endpoint', () => {
      let experimentId = '1';

      service.deleteExperiment(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/deleteExperiment/${experimentId}`);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('downloadExperiment', () => {
    it('should send a GET request to the downloadResults endpoint', () => {
      let experimentId = '1';
      let format = 'json';

      service.downloadExperiment(experimentId, 'json').subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/downloadResults/${experimentId}/${format}`);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('getDescription', () => {
    it('should send a GET request to the getDescription endpoint', () => {
      let experimentId = '1';

      service.getDescription(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/getDescription/${experimentId}`);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('getRoundsAndTrackingInfo', () => {
    it('should send a GET request to the getRoundsAndTrackingInfo endpoint', () => {
      let experimentId = '1';

      service.getRoundsAndTrackingInfo(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/getRoundsAndTrackingInfo/${experimentId}`);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('getForm', () => {
    it('should send a GET request to the getForm endpoint', () => {
      let experimentId = '1';

      service.getForm(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/getForm/${experimentId}`);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('hasForm', () => {
    it('should send a GET request to the hasForm endpoint', () => {
      let experimentId = '1';

      service.hasForm(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/participant/hasForm/${experimentId}`);
      expect(req.request.method).toEqual('GET');
    });
  });
});
