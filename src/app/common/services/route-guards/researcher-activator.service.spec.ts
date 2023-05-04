import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ResearcherActivatorService } from './researcher-activator.service';

describe('ResearcherActivatorService', () => {
  let service: ResearcherActivatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ResearcherActivatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
