import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedCanvasComponent } from './expanded-canvas.component';
import { IShape } from 'src/app/common/models/shape.model';

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

  describe('getLabel', () => {
    it('should return Distraction Shape', () => {
      const shape: IShape = {
        target: false,
        distraction: true,
        type: 'rect',
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        fill: '#00ff00',
        strokeWidth: 0,
      };
      expect(component.getLabel(shape)).toEqual('Distraction Shape');
    });

    it('should return Target Shape', () => {
      const shape: IShape = {
        target: true,
        distraction: false,
        type: 'rect',
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        fill: '#00ff00',
        strokeWidth: 0,
      };
      expect(component.getLabel(shape)).toEqual('Target Shape');
    });

    it('should return Base Shape', () => {
      const shape: IShape = {
        target: false,
        distraction: false,
        type: 'rect',
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        fill: '#00ff00',
        strokeWidth: 0,
      };
      expect(component.getLabel(shape)).toEqual('Base Shape');
    });
  });

  describe('getType', () => {
    it('should return Circle', () => {
      const shape: IShape = {
        target: false,
        distraction: false,
        type: 'circle',
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        radius: 50,
        fill: '#00ff00',
        strokeWidth: 0,
      };
      expect(component.getType(shape)).toEqual('Circle');
    });

    it('should return Rectangle', () => {
      const shape: IShape = {
        target: false,
        distraction: false,
        type: 'rect',
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        fill: '#00ff00',
        strokeWidth: 0,
      };
      expect(component.getType(shape)).toEqual('Rectangle');
    });

    it('should return Rectangle', () => {
      const shape: IShape = {
        target: false,
        distraction: false,
        type: 'rect',
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        fill: '#00ff00',
        strokeWidth: 0,
      };
      expect(component.getType(shape)).toEqual('Rectangle');
    });
  });
});
