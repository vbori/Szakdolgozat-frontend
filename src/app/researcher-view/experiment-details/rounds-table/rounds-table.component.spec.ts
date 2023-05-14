import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatTableModule} from '@angular/material/table';

import { RoundsTableComponent } from './rounds-table.component';

describe('RoundsTableComponent', () => {
  let component: RoundsTableComponent;
  let fixture: ComponentFixture<RoundsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsTableComponent ],
      imports: [MatTableModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create table', () => {
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
  });
});
