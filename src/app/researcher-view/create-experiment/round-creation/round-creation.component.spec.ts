import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatTabsModule} from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RoundCreationComponent } from './round-creation.component';

describe('RoundCreationComponent', () => {
  let component: RoundCreationComponent;
  let fixture: ComponentFixture<RoundCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundCreationComponent ],
      imports: [MatTabsModule, NoopAnimationsModule]
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
