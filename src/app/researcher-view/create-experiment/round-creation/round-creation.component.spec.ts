import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCreationComponent } from './round-creation.component';

describe('RoundCreationComponent', () => {
  let component: RoundCreationComponent;
  let fixture: ComponentFixture<RoundCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
