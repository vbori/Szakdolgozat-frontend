import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsGeneratorComponent } from './rounds-generator.component';

describe('RoundsGeneratorComponent', () => {
  let component: RoundsGeneratorComponent;
  let fixture: ComponentFixture<RoundsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
