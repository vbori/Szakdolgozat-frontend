import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FabricShape, Round, Shape } from 'src/app/common/models/round.model';
import { fabric } from 'fabric';

@Component({
  selector: 'app-expanded-canvas',
  templateUrl: './expanded-canvas.component.html',
  styleUrls: ['./expanded-canvas.component.scss']
})
export class ExpandedCanvasComponent implements AfterViewInit, OnInit{
  @Input() round: Round | null;
  canvas: fabric.Canvas | undefined = undefined;
  canvasLoaded = false;
  shapes: Shape[] = [];
  baseShape: Shape;
  targetShape: Shape;
  distractingShape: Shape;
  displayedColumns: string[] = ['Base shape', 'Target shape', 'Distraction shape'];

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.shapes = this.round?.objects ?? [];
  }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas(`canvas${this.round?.roundIdx}`);
    this.canvas.setWidth(this.round?.canvasWidth ?? 500);
    this.canvas.setHeight(this.round?.canvasHeight ?? 500);
    this.canvas.backgroundColor = this.round?.background ?? 'white';
    this.canvas.selection = false;
    this.canvas.hoverCursor = 'default';
    this.canvas.loadFromJSON(this.round, this.canvas.renderAll.bind(this.canvas), (o: any, shape: FabricShape) => {
      shape.set('selectable', false);
    });
    this.canvas.renderAll();
    this.changeDetector.detectChanges();
  }

  getLabel(shape: Shape): string {
    if(shape.distraction) {
      return 'Distraction Shape';
    }else if(shape.target) {
      return 'Target Shape';
    }else {
      return 'Base Shape';
    }
  }

  getType(shape: Shape): string {
    if(shape.type === 'circle') {
      return 'Circle';
    }else if(shape.type === 'rect') {
      return 'Rectangle';
    }else{
      return 'Rectangle';
    }
  }
}
