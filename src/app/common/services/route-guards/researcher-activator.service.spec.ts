import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ResearcherActivatorService } from './researcher-activator.service';

describe('ResearcherActivatorService', () => {
  let service: ResearcherActivatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(ResearcherActivatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when user is logged in', () => {
    service.isLoggedIn = true;
    expect(service.canActivate()).toBeTruthy();
  });
});
