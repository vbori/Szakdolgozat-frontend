import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatTabsModule} from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResearcherOverviewComponent } from './researcher-overview.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ResearcherOverviewComponent', () => {
  let component: ResearcherOverviewComponent;
  let fixture: ComponentFixture<ResearcherOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherOverviewComponent ],
      imports: [MatTabsModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
