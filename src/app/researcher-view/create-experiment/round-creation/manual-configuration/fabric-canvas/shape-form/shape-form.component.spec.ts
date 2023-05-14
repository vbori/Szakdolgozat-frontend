import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ShapeFormComponent } from './shape-form.component';
import { fabric } from 'fabric';
import { FabricShape } from 'src/app/common/models/shape.model';

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
      strokeWidth: 0,
    }) as FabricShape;
    component.canvas = new fabric.Canvas('canvas');
    component.canvas.setWidth(600);
    component.canvas.setHeight(600);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    expect(component.shapeConfigForm).toBeTruthy();
  });

  it('should set shape\'s width when width field is changed', () => {
    component.shapeConfigForm.controls.width.setValue(100);
    component.setObjectAttribute('width', String(100));
    expect(component.shape.getScaledWidth()).toBe(100);
  });

  it('should set shape\'s height when height field is changed', () => {
    component.shapeConfigForm.controls.height.setValue(100);
    component.setObjectAttribute('height', String(100));
    expect(component.shape.getScaledHeight()).toBe(100);
  });

  it('should set shape\'s left when left field is changed', () => {
    component.shapeConfigForm.controls.left.setValue(100);
    component.setObjectAttribute('left', String(100));
    expect(component.shape.left).toBe(100);
  });

  it('should set shape\'s top when top field is changed', () => {
    component.shapeConfigForm.controls.top.setValue(100);
    component.setObjectAttribute('top', String(100));
    expect(component.shape.top).toBe(100);
  });

  it('should set shape\'s fill when color field is changed', () => {
    component.shapeConfigForm.controls.fill.setValue('#ff0000');
    component.setObjectAttribute('fill', '#ff0000');
    expect(component.shape.fill).toBe('#ff0000');
  });
});
