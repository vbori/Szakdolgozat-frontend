import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ShapeFormComponent } from './shape-form.component';
import { fabric } from 'fabric';
import { FabricShape } from 'src/app/common/models/round.model';

describe('ShapeFormComponent', () => {
  let component: ShapeFormComponent;
  let fixture: ComponentFixture<ShapeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapeFormComponent ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeFormComponent);
    component = fixture.componentInstance;
    component.index = 0;
    component.shapesIntersect = false;
    component.shape = new fabric.Rect({
      type: 'rect',
      left:  0,
      top:  0,
      height: 50,
      width: 50,
      fill: '#00ff00',
      originX: 'left',
      originY: 'top',
    }) as FabricShape;
    component.canvas = new fabric.Canvas('canvas');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
