import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherOverviewComponent } from './researcher-overview.component';

describe('ResearcherOverviewComponent', () => {
  let component: ResearcherOverviewComponent;
  let fixture: ComponentFixture<ResearcherOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherOverviewComponent ]
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
