import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExperimentService } from './experiment.service';

describe('ExperimentService', () => {
  let service: ExperimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ExperimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
