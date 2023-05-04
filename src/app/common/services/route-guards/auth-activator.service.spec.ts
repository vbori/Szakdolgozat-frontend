import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthActivatorService } from './auth-activator.service';

describe('LoginActivatorService', () => {
  let service: AuthActivatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthActivatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
