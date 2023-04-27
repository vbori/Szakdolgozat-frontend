import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedCanvasComponent } from './expanded-canvas.component';

describe('ExpandedCanvasComponent', () => {
  let component: ExpandedCanvasComponent;
  let fixture: ComponentFixture<ExpandedCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandedCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
