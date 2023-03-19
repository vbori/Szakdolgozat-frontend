import { TestBed } from '@angular/core/testing';

import { AuthActivatorService } from './auth-activator.service';

describe('LoginActivatorService', () => {
  let service: AuthActivatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthActivatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
