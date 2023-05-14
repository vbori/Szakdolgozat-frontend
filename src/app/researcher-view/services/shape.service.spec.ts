import { TestBed } from '@angular/core/testing';
import { ShapeService } from './shape.service';
import { fabric } from 'fabric';
import { FabricShape } from 'src/app/common/models/shape.model';

describe('ShapeService', () => {
  let service: ShapeService;
  let rectangle = new fabric.Rect({
    type: 'rect',
    width: 100,
    height:100,
    originX: 'left',
    originY: 'top',
    fill: '#ff0000',
    strokeWidth:0
  }) as FabricShape;

  let circle = new fabric.Circle({
    type: 'circle',
    width: 100,
    height: 100,
    originX: 'left',
    originY:  'top',
    fill: '#ff0000',
    radius: 50,
    strokeWidth:0
  }) as FabricShape;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changeShapeType', () => {
    it('should change rectangle to circle', () => {
      let newShape = service.changeShapeType('circle', rectangle);
      expect(newShape.type).toBe('circle');
    });

    it('should change circle to rectangle', () => {
      let newShape = service.changeShapeType('rect', circle);
      expect(newShape.type).toBe('rect');
    });

    it('should keep same size when changing circle to rectangle', () => {
      let newShape = service.changeShapeType('rect', circle);
      expect(newShape.width).toBe(100);
      expect(newShape.height).toBe(100);
    });
  });
});
