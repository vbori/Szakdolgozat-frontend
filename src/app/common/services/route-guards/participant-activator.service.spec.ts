import { TestBed } from '@angular/core/testing';

import { ParticipantActivatorService } from './participant-activator.service';

describe('ParticipantActivatorService', () => {
  let service: ParticipantActivatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantActivatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
