import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { FabricShape } from 'src/app/common/models/newRound.model';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor() { }
  changeShapeType(newType: string, currentShape : FabricShape): FabricShape {
    let shape: FabricShape;
    let width = currentShape.getScaledWidth();
    let height = currentShape.getScaledHeight();
    let { left, top, fill, target, distraction, originX, originY } = currentShape;
    switch (newType) {
      case 'circle':
        let newSize: number;
        if(height && width){
          newSize = Math.min(width, height)
        }else if(height){
          newSize = height;
        }else if(width){
          newSize = width;
        }else{
          newSize = 50;
        }

        shape = new fabric.Circle({
          type: 'circle',
          left: left,
          top: top,
          height: newSize,
          width: newSize,
          fill: fill,
          radius: parseFloat((newSize / 2.0).toFixed(2)),
          originX: originX,
          originY: originY
        }) as FabricShape;
        shape.setControlsVisibility({mr: false, ml: false, mt: false, mb: false});
        break;
      case 'rect':
        shape = new fabric.Rect({
          type: 'rect',
          left: left,
          top: top,
          height: height,
          width: width,
          fill: fill,
          originX: originX,
          originY: originY
        }) as FabricShape;
        break;
      default:
        throw new Error('Invalid shape type');
    }
    shape.setControlsVisibility({ mtr: false });
    shape.set('noScaleCache', false);
    shape.set("strokeWidth", 0);
    shape.target = target;
    shape.distraction = distraction;
    return shape;
  }

}
