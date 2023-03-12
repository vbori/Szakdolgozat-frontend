import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherViewComponent } from './researcher-view.component';

describe('ResearcherViewComponent', () => {
  let component: ResearcherViewComponent;
  let fixture: ComponentFixture<ResearcherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
