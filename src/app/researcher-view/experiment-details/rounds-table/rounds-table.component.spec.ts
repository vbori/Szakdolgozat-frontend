import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsTableComponent } from './rounds-table.component';

describe('RoundsTableComponent', () => {
  let component: RoundsTableComponent;
  let fixture: ComponentFixture<RoundsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
