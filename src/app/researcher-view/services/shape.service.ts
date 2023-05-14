import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { FabricShape } from 'src/app/common/models/shape.model';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor() { }
  changeShapeType(newType: string, currentShape : FabricShape): FabricShape {
    let shape: FabricShape;
    let width = Math.round(currentShape.getScaledWidth());
    let height = Math.round(currentShape.getScaledHeight());
    let { left, top, fill, target, distraction, originX, originY, flashing } = currentShape;
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
          left: left ? Math.floor(left): 0,
          top: top ? Math.floor(top): 0,
          height: newSize,
          width: newSize,
          fill: fill,
          //radius: Math.round((newSize / 2.0)),
          radius: newSize / 2.0,
          originX: originX,
          originY: originY
        }) as FabricShape;
        shape.setControlsVisibility({mr: false, ml: false, mt: false, mb: false});
        break;
      case 'rect':
        shape = new fabric.Rect({
          type: 'rect',
          left: left ? Math.floor(left): 0,
          top: top ? Math.floor(top): 0,
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
    shape.flashing = flashing;
    console.log(shape)
    return shape;
  }

}
