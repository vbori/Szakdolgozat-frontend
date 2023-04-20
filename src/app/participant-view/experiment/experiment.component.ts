import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';
import {NewRound, FabricShape} from '../../common/models/newRound.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})

export class ExperimentComponent implements OnInit{
  @Input() experimentId: string;
  @Input() demoMode: boolean; //TODO: handle demo mode
  @Input() participantId: string;
  @Output() finishedExperiment = new EventEmitter();

  mainCanvas: fabric.Canvas;
  hiddenCanvas: any; //TODO: type this

  clicked: boolean = false;
  background: string | undefined = 'white';
  backgroundFlashColor: string | undefined = 'black';
  maxCount: number;

  counter: number = 0;
  baseShape: FabricShape  | undefined;
  targetShape: FabricShape | undefined;
  isDrawing = false;

  cursorImageMode: string | null = null;
  positionTrackingFrequency: number | null = null;

  //TODO: get this from the server
  rounds: NewRound[] = [
    {"objects":[{"type":"rect","target":false, "originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"green"},{"type":"circle","target":true,"baseColor":"yellow", "flashing": {"color": "red","frequency": 500},"originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"yellow","radius":100}],"background":"black","canvasHeight":1000,"canvasWidth":1000}, {"objects":[{"type":"rect","target":false,"originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"#29477F"},{"type":"circle","target":true,"originX":"center","originY":"center","left":100,"top":400,"width":200,"height":200,"fill":"rgb(166,111,213)","radius":100}],"background":"red","canvasHeight":500,"canvasWidth":500},{"objects":[{"type":"rect","target":false,"originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"green"},{"type":"circle","target":true, "baseColor":"yellow", "flashing": {"color": "red","frequency": 500},  "originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"yellow","radius":100}],"background":"black","canvasHeight":500,"canvasWidth":500,"backgroundFlashing": {"color":"blue","frequency":500}} ];

  constructor(private readonly experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.experimentService.getRoundsAndTrackingInfo(this.experimentId).subscribe({
      next: (response) => {
        console.log(response.rounds);
        this.cursorImageMode = response.cursorImageMode;
        this.positionTrackingFrequency = response.positionTrackingFrequency;
        this.playRound(this.rounds[this.counter]);

        /*this.rounds = response.rounds;
        this.maxCount = this.rounds.length; */
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });

    this.maxCount = this.rounds.length;
  }

  ngAfterViewInit(): void {
    this.mainCanvas = new fabric.Canvas('mainCanvas');
    this.mainCanvas.selection = false;
    this.mainCanvas.hoverCursor = 'pointer';

    this.hiddenCanvas = new fabric.Canvas('hiddenCanvas', {containerClass: 'hiddenCanvas'});
    this.hiddenCanvas.selection = false;

    this.mainCanvas.on('mouse:move',({e})=> {
      if (this.hiddenCanvas.isDrawingMode) {
        const pointer = this.mainCanvas.getPointer(e);
        this.hiddenCanvas.freeDrawingBrush.color = this.background == 'red' ? 'blue' : 'red';
        this.hiddenCanvas.freeDrawingBrush.onMouseMove(pointer,{e: true});
      }
    });
  }

  initializeCanvases(round: NewRound): void{
    this.hiddenCanvas.isDrawingMode = false;
    this.mainCanvas.clear();
    this.hiddenCanvas.clear();

    this.mainCanvas.setHeight(round.canvasHeight);
    this.mainCanvas.setWidth(round.canvasWidth);

    this.hiddenCanvas.setHeight(this.mainCanvas.getHeight());
    this.hiddenCanvas.setWidth(this.mainCanvas.getWidth());
  }

  loadObjectsAndFlashing(round: NewRound): void{
    this.mainCanvas.loadFromJSON(round, this.mainCanvas.renderAll.bind(this.mainCanvas), (o: any, object: any) => {
      object.set('selectable', false);
      if(object.flashing){
        setInterval(() => {
          object.set('fill', object.fill == object.baseColor ? object.flashing.color : object.baseColor);
          this.mainCanvas.renderAll();
        }, object.flashing.frequency);
      }
    });

    if(round.backgroundFlashing){
      setInterval(() => {
        this.mainCanvas.backgroundColor = this.mainCanvas.backgroundColor == this.background ? this.backgroundFlashColor : this.background;
        this.mainCanvas.renderAll();
      }, round.backgroundFlashing?.frequency);
    }

    if(this.cursorImageMode != null)
    this.hiddenCanvas.loadFromJSON(round, this.hiddenCanvas.renderAll.bind(this.hiddenCanvas), (o: any, object: any) => {
      object.set('selectable', false);
      if(this.cursorImageMode == 'Outlines only'){
        object.set('fill', 'white');
        object.set('stroke', 'black');
      }
    });

    if(this.cursorImageMode == 'Outlines only'){
      this.hiddenCanvas.backgroundColor = 'white';
    }
  }

  playRound(round: NewRound) {
    console.log("in playround")

    this.background = round.background;
    if(round.backgroundFlashing?.color){
      this.backgroundFlashColor = round.backgroundFlashing?.color;
    }

    this.initializeCanvases(round);
    this.loadObjectsAndFlashing(round);

    let mainObjects = this.mainCanvas.getObjects() as FabricShape[];
    this.baseShape = mainObjects.find((shape: FabricShape) => !shape.target) ?? undefined;
    this.targetShape = mainObjects.find((shape: FabricShape) => shape.target) ?? undefined;

    if(this.baseShape == undefined || this.targetShape == undefined){
      return; //TODO: handle error
    }

    this.baseShape.on('mousedown', this.handleBaseShapeClick.bind(this));
    this.baseShape.on('mouseover', this.handleBaseShapeHover.bind(this));
    this.targetShape.on('mousedown', this.handleTargetShapeClick.bind(this));
  }

  handleBaseShapeClick(): void {
    if (this.clicked) {
      this.clicked = false;
      this.counter++;
      const imageData = this.hiddenCanvas.toDataURL("image/jpeg", 0.75);
      this.experimentService.saveImage(imageData, this.experimentId, this.participantId, this.counter - 1).subscribe({
        next: (response) => {
        console.log('Image uploaded to server', response);
        },
        error:(error)  => {
        console.error('Failed to upload image to server', error);
        }
      });

      if (this.counter < this.maxCount) {
        console.log('setup')
        this.playRound(this.rounds[this.counter]);
      } else {
        this.mainCanvas.clear();
        this.finishedExperiment.emit();
        return
      }

      /*this.hiddenCanvas.getElement().toBlob((blob:any) => {
        if(blob != null){
          //TODO: save this on the server
          const link = document.createElement('a');
          link.download = 'myCanvas.jpg';
          link.href = URL.createObjectURL(blob);
          link.click();
          console.log('downloaded');

          //const formData = new FormData();
          //formData.append('image', blob, 'myCanvas.jpg');
          //console.log(formData)



        }

        if (this.counter < this.maxCount) {
          console.log('setup')
          this.playRound(this.rounds[this.counter]);
        } else {
          this.mainCanvas.clear();
          this.finishedExperiment.emit();
          return
        }


      });*/
    }
  }

  handleTargetShapeClick(): void {
    this.clicked = true;
    this.hiddenCanvas.freeDrawingBrush._finalizeAndAddPath();
    this.hiddenCanvas.isDrawingMode = false;
  }

  handleBaseShapeHover(): void {
    if(!this.clicked && !this.hiddenCanvas.isDrawingMode){
      this.hiddenCanvas.isDrawingMode = true;
    }
  }


  //TODO: add result tracking
  //TODO: add result saving

}
