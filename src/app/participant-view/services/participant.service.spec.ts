import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ParticipantService } from './participant.service';

describe('ParticipantService', () => {
  let service: ParticipantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ParticipantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
