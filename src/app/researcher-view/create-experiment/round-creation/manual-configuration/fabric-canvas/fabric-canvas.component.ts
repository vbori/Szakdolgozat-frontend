import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fabric } from 'fabric';
import { FabricShape } from 'src/app/common/models/newRound.model';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements AfterViewInit{
  canvas: fabric.Canvas;
  @Input() canvasWidth: number;
  @Input() canvasHeight: number;
  @Input() background: string;

  selectedTabIndex = 0;
  shapes: FabricShape[] = [];
  distractingShape: FabricShape | undefined = undefined;
  targetShape: FabricShape | undefined = undefined;
  baseShape: FabricShape | undefined = undefined;

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('myCanvas');
    this.canvas.setHeight(this.canvasHeight);
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.selection = false;
    fabric.Object.NUM_FRACTION_DIGITS = 2;

    this.canvas.loadFromJSON(this.canvasData, this.canvas.renderAll.bind(this.canvas), (o: any, object: any) => {
      object.setControlsVisibility({ mtr: false });
      object.set('noScaleCache', false);
      if(object.type === 'circle') {
        object.setControlsVisibility({mr: false, ml: false, mt: false, mb: false});
      }
      if(object.distraction) {
        object.set('visible', false);
        this.distractingShape = object;
      }else  if(object.target) {
        this.targetShape = object;
      }else {
        this.baseShape = object;
      }
    });
    this.canvas.backgroundColor =  this.background;
    this.canvas.renderAll();
    this.cd.detectChanges();
  }

  canvasData = {
    "objects": [
      {
        "type": "rect",
        "originX": "left",
        "originY": "top",
        "left": 40,
        "top": 40,
        "width": 50,
        "height": 50,
        "fill": "#ff0000",
        "distraction": false,
        "target": true,
        "strokeWidth": 0
      },
      {
        "type": "circle",
        "originX": "left",
        "originY": "top",
        "left": 100,
        "top": 100,
        "radius": 25,
        "width": 50,
        "height": 50,
        "fill": "#0000ff",
        "distraction": false,
        "target": false,
        "strokeWidth": 0
      },
      {
        "type": "circle",
        "originX": "left",
        "originY": "top",
        "left": 200,
        "top": 100,
        "radius": 25,
        "width": 50,
        "height": 50,
        "fill": "#00ff00",
        "distraction": true,
        "target": false,
        "strokeWidth": 0
      }
    ]
  }
}
