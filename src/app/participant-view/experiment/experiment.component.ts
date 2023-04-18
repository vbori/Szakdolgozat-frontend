import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import {NewRound} from '../../common/models/newRound.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit{
  @Input() experimentId: string;
  @Input() demoMode: boolean; //TODO: handle demo mode
  mainCanvas: fabric.Canvas;
  hiddenCanvas: any; //TODO: type this
  clicked: boolean = false;
  //TODO: get this from the server
  rounds= [
    {"objects":[{"type":"rect","target":false, "originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"green","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"visible":true,"clipTo":null,"rx":0,"ry":0,"x":0,"y":0},{"type":"circle","target":true,"baseColor":"yellow", "flashColor": "red","flashFrequency": 500,"originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"yellow","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"visible":true,"clipTo":null,"radius":100}],"background":"white","canvasHeight":1000,"canvasWidth":1000}, {"objects":[{"type":"rect","target":false,"originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"#29477F","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"visible":true,"clipTo":null,"rx":0,"ry":0,"x":0,"y":0},{"type":"circle","target":true,"originX":"center","originY":"center","left":100,"top":400,"width":200,"height":200,"fill":"rgb(166,111,213)","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"visible":true,"clipTo":null,"radius":100}],"background":"white","canvasHeight":500,"canvasWidth":500},{"objects":[{"type":"rect","target":false,"originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"green","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"visible":true,"clipTo":null,"rx":0,"ry":0,"x":0,"y":0},{"type":"circle","target":true, "baseColor":"yellow","flashColor": "red","flashFrequency": 500,  "originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"yellow","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"visible":true,"clipTo":null,"radius":100}],"background":"white","backgroundFlashColor":"blue","backgroundFlashFrequency":500, "canvasHeight":500,"canvasWidth":500} ];
  maxCount: number;
  counter: number = 0;
  baseShape: NewRound  | undefined;
  targetShape: NewRound | undefined;
  isDrawing = false;
  @Output() finishedExperiment = new EventEmitter();

  constructor(private readonly experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.experimentService.getRounds(this.experimentId).subscribe({
      next: (rounds) => {
        console.log(rounds);
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
    this.maxCount = this.rounds.length;
    this.mainCanvas = new fabric.Canvas('mainCanvas');
    this.mainCanvas.setHeight(this.rounds[this.counter].canvasHeight);
    this.mainCanvas.setWidth(this.rounds[this.counter].canvasWidth);
    this.hiddenCanvas = new fabric.Canvas('hiddenCanvas', {containerClass: 'hiddenCanvas'});
    this.hiddenCanvas.setHeight(this.mainCanvas.getHeight());
    this.hiddenCanvas.setWidth(this.mainCanvas.getWidth());

    this.hiddenCanvas.selection = false;
    this.mainCanvas.selection = false;

    this.mainCanvas.on('mouse:move',({e})=> {
      if (this.hiddenCanvas.isDrawingMode) {
        const pointer = this.mainCanvas.getPointer(e);
        this.hiddenCanvas.freeDrawingBrush.color = 'red';
        this.hiddenCanvas.freeDrawingBrush.onMouseMove(pointer,{e: true});
      }
    });
  }

  ngAfterViewInit(): void {
    this.setup();
  }

  //TODO: refactor setup to be more readable
  setup() {
    this.hiddenCanvas.isDrawingMode = false;
    this.mainCanvas.clear();
    this.hiddenCanvas.clear();

    this.mainCanvas.loadFromJSON(this.rounds[this.counter], this.mainCanvas.renderAll.bind(this.mainCanvas), (o: any, object: any) => {
      object.set('selectable', false);
      if(object.flashColor){
        setInterval(() => {
          object.set('fill', object.fill == object.baseColor ? object.flashColor : object.baseColor);
          this.mainCanvas.renderAll();
        }, object.flashFrequency);
      }
    });

    if(this.rounds[this.counter].backgroundFlashColor){
      setInterval(() => {
        this.mainCanvas.backgroundColor = this.mainCanvas.backgroundColor == this.rounds[this.counter].background ? this.rounds[this.counter].backgroundFlashColor : this.rounds[this.counter].background;
        this.mainCanvas.renderAll();
      }, this.rounds[this.counter].backgroundFlashFrequency); //TODO: resolve undefined background error
    }

    this.hiddenCanvas.loadFromJSON(this.rounds[this.counter], this.hiddenCanvas.renderAll.bind(this.hiddenCanvas), (o: any, object: any) => {
      object.set('selectable', false);
    });

    let mainObjects = this.mainCanvas.getObjects() as NewRound[];
    this.baseShape = mainObjects.find((shape: NewRound) => !shape.target) ?? undefined;
    this.targetShape = mainObjects.find((shape: NewRound) => shape.target) ?? undefined;

    if(this.baseShape == undefined || this.targetShape == undefined){
      return;
    }

    this.baseShape.on('mousedown', (e) => {
      if (this.clicked) {
        this.clicked = false;
        this.counter++;
        this.hiddenCanvas.getElement().toBlob((blob:any) => {
          if(blob != null){
            //TODO: save this on the server
            const link = document.createElement('a');
            link.download = 'myCanvas.jpg';
            link.href = URL.createObjectURL(blob);
            link.click();
            console.log('downloaded');
          }
          this.hiddenCanvas.clear();
          console.log('cleared');

          if (this.counter < this.maxCount) {
            console.log('setup')
            this.setup();
          } else {
            this.mainCanvas.clear();
            this.finishedExperiment.emit();
            return
          }
        });
      }
    });

    this.baseShape.on('mouseout', (e) => {
      if(!this.clicked && !this.hiddenCanvas.isDrawingMode){
        this.hiddenCanvas.isDrawingMode = true;
        this.hiddenCanvas.freeDrawingBrush = new fabric.PencilBrush(this.hiddenCanvas);
        this.hiddenCanvas.freeDrawingBrush.width = 1;
        this.hiddenCanvas.freeDrawingBrush.color = 'red';
      }
    });

    this.targetShape.on('mousedown', () => {
      this.clicked = true;
      this.hiddenCanvas.freeDrawingBrush._finalizeAndAddPath();
      this.hiddenCanvas.isDrawingMode = false;
    });
  }

  //TODO: add result tracking
  //TODO: add result saving

}
