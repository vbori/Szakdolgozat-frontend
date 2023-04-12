import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualConfigurationComponent } from './manual-configuration.component';

describe('ManualConfigurationComponent', () => {
  let component: ManualConfigurationComponent;
  let fixture: ComponentFixture<ManualConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
