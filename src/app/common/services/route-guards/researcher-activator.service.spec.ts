import { TestBed } from '@angular/core/testing';

import { ResearcherActivatorService } from './researcher-activator.service';

describe('ResearcherActivatorService', () => {
  let service: ResearcherActivatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResearcherActivatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
