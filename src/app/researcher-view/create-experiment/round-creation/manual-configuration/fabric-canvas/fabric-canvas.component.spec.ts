import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FabricCanvasComponent } from './fabric-canvas.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FabricCanvasComponent', () => {
  let component: FabricCanvasComponent;
  let fixture: ComponentFixture<FabricCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricCanvasComponent ],
      imports: [
        MatFormFieldModule,
        MatCheckboxModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricCanvasComponent);
    component = fixture.componentInstance;
    component.canvasWidth = 600;
    component.canvasHeight = 600;
    component.roundIdx = 0;
    component.round = {objects: [{type: 'rect', target: false, distraction: false, originX: 'left', originY: 'top', left: 0, top: 0, width: 50, height: 50, fill: '#00ff00', strokeWidth: 0 },{type: 'rect', target: true, distraction: false, originX: 'left', originY: 'top', left: 200, top: 200, width: 50, height: 50, fill: '#ff0000', strokeWidth: 0 } ], background:'#fff', canvasWidth: 600, canvasHeight:600 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
