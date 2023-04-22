import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';
import {NewRound, FabricShape} from '../../common/models/newRound.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { Click, Position, Result } from 'src/app/common/models/result.model';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})

export class ExperimentComponent implements OnInit{
  @Input() experimentId: string;
  @Input() demoMode: boolean; //TODO: handle demo mode
  @Input() participantId: string;
  @Input() controlMode: boolean;
  @Output() finishedExperiment = new EventEmitter();

  cursorImageMode: string | null = null;
  positionTrackingFrequency: number | null = null;

  mainCanvas: fabric.Canvas;
  hiddenCanvas: any; //TODO: type this
  distractingShape:  FabricShape | undefined = undefined;

  backgroundDistractionOn: boolean | undefined = undefined;
  shapeDistractionOn: boolean | undefined = undefined;
  background: string | undefined = 'white';
  backgroundFlashColor: string | undefined = 'black';
  distractingBackground: string | undefined ='blue';
  maxCount: number;
  counter: number = 0;
  clicked: boolean = false;
  startTime: number | undefined = undefined;
  trackable: boolean = false;
  positionTracker: any = undefined;
  previousCursorPosition: Position | undefined = undefined;

  clicks: Click[] = [];
  misclickCount: number = 0;
  timeNeeded: number;
  cursorPositions: Position[] = [];
  cursorPathLength: number = 0;

  //TODO: get this from the server
  rounds: NewRound[] = [
    {"objects":[{"type":"rect","target":false, "originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"green", "distraction": false},{"type":"rect","target":false, "originX":"center","originY":"center","left":300,"top":300,"width":150,"height":150,"fill":"green", "distraction": true, "flashing": {"color": "red","frequency": 500}},{"type":"circle","target":true,"baseColor":"yellow", "flashing": {"color": "red","frequency": 500},"originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"yellow","radius":100, "distraction": false}],"background":"black","canvasHeight":1000,"canvasWidth":1000, "shapeDistractionDuration":3000, "roundId": "641dd2cb416e154f1ad8b12f", "roundIdx": 1}, {"objects":[{"type":"rect","target":false,"originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"#29477F", "distraction": false},{"type":"circle","target":true,"originX":"center","originY":"center","left":100,"top":400,"width":200,"height":200,"fill":"rgb(166,111,213)","radius":100,"distraction": false}],"background":"red","canvasHeight":500,"canvasWidth":500, "roundId": "641dd2cb416e154f1ad8b12f", "roundIdx": 2},{"objects":[{"type":"rect","target":false,"originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"green", "distraction": false},{"type":"circle","target":true, "baseColor":"yellow", "flashing": {"color": "red","frequency": 500},  "originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"yellow","radius":100, "distraction": false}],"background":"black","canvasHeight":500,"canvasWidth":500,"backgroundDistraction": {"color": "white","duration":  2000,"flashing": {"color":"blue","frequency":500}}, "roundId": "641dd2cb416e154f1ad8b12f", "roundIdx": 3}];

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

    this.mainCanvas.on('mouse:move', ({e}) => this.handleMouseMove(e));
    this.mainCanvas.on('mouse:down', ({e}) => this.handleMouseDown(e));
  }

  playRound(round: NewRound) {
    this.initializeRound();
    this.setBackground(round);
    this.loadMainCanvas(round);
    if(this.cursorImageMode != null){
      this.loadHiddenCanvas(round);
    }
  }

  initializeRound(){
    if(this.positionTrackingFrequency){
      this.positionTracker = setInterval(() => {
        this.trackable = true;
      }, this.positionTrackingFrequency);
    }
    this.cursorPathLength = 0;
    this.clicks = [];
    this.misclickCount = 0;
    this.cursorPositions = [];
    this.startTime = undefined;
    this.backgroundDistractionOn = undefined;
    this.shapeDistractionOn = undefined;
  }

  setBackground(round: NewRound){
    this.background = round.background;
    this.distractingBackground = round.backgroundDistraction?.color;
    if(round.backgroundDistraction?.flashing?.color){
      this.backgroundFlashColor = round.backgroundDistraction.flashing.color;
    }
  }

  loadMainCanvas(round: NewRound): void{
    this.mainCanvas.clear();
    this.mainCanvas.setHeight(round.canvasHeight);
    this.mainCanvas.setWidth(round.canvasWidth);

    this.mainCanvas.loadFromJSON(round, this.mainCanvas.renderAll.bind(this.mainCanvas), (o: any, object: any) => {
      object.set('selectable', false);
      object.set('perPixelTargetFind',true);

      if(object.distraction){
        object.set('visible', false);
        object.set('evented', false);
        this.distractingShape = object;
      }else{
        if(object.target){
          object.on('mousedown', this.handleTargetShapeClick.bind(this));
        }else{
          object.on('mousedown', this.handleBaseShapeClick.bind(this));
          object.on('mouseover', this.handleBaseShapeHover.bind(this));
          object.on('mouseout', this.handleBaseShapeLeave.bind(this));
        }
      }

      if(object.flashing){
        setInterval(() => {
          object.set('fill', object.fill == object.baseColor ? object.flashing.color : object.baseColor);
          this.mainCanvas.renderAll();
        }, object.flashing.frequency);
      }
    });

  }

  loadHiddenCanvas(round: NewRound): void{
    this.hiddenCanvas.isDrawingMode = false;
    this.hiddenCanvas.clear();

    this.hiddenCanvas.setHeight(this.mainCanvas.getHeight());
    this.hiddenCanvas.setWidth(this.mainCanvas.getWidth());

    this.hiddenCanvas.loadFromJSON(round, this.hiddenCanvas.renderAll.bind(this.hiddenCanvas), (o: any, object: any) => {
      object.set('selectable', false);
      if(!object.distraction){
        if(this.cursorImageMode == 'Outlines only'){
          object.set('fill', 'white');
          object.set('stroke', 'black');
        }
      }else{
        object.set('visible', false);
      }
    });

    if(this.cursorImageMode == 'Outlines only'){
      this.hiddenCanvas.backgroundColor = 'white';
    }
  }

  handleBaseShapeClick(): void {
    if (this.clicked) {
      if(!this.demoMode){
        this.saveResults(this.counter);
      }

      this.clicked = false;
      this.counter++;

      if (this.counter < this.maxCount) {
        this.playRound(this.rounds[this.counter]);
      } else {
        this.mainCanvas.clear();
        this.finishedExperiment.emit();
        return
      }
    }
  }

  handleTargetShapeClick(): void {
    this.clicked = true;
    if(this.startTime != undefined){
      this.timeNeeded = new Date().getTime() - this.startTime;
    }

    if(this.positionTracker){
      clearInterval(this.positionTracker);
    }

    if(this.cursorImageMode != null){
      this.hiddenCanvas.freeDrawingBrush._finalizeAndAddPath();
      this.hiddenCanvas.isDrawingMode = false;
    }
  }

  handleBaseShapeHover(): void {
    if(!this.clicked){
      if(this.cursorImageMode != null && !this.hiddenCanvas.isDrawingMode){
        this.hiddenCanvas.isDrawingMode = true;
        this.hiddenCanvas.freeDrawingBrush = new fabric.PencilBrush(this.hiddenCanvas);
      }
      if(this.startTime == undefined)
        this.startTime = new Date().getTime();
    }
  }

  handleBaseShapeLeave(): void {
    if(!this.clicked && !this.controlMode){
      if(this.rounds[this.counter].backgroundDistraction && this.backgroundDistractionOn == undefined){
        this.backgroundDistractionOn = true;
        this.mainCanvas.backgroundColor = this.distractingBackground;
        this.mainCanvas.renderAll();

        let interval: any = undefined;
        if(this.rounds[this.counter].backgroundDistraction?.flashing){
          interval = setInterval(() => {
            this.mainCanvas.backgroundColor = this.mainCanvas.backgroundColor == this.distractingBackground ? this.backgroundFlashColor : this.distractingBackground;
            this.mainCanvas.renderAll();
          }, this.rounds[this.counter].backgroundDistraction?.flashing?.frequency);
        }

        setTimeout(() => {
          this.mainCanvas.backgroundColor = this.background;
          if(interval != null){
            clearInterval(interval);
            this.backgroundDistractionOn = false;
          }
          this.mainCanvas.renderAll();
        }, this.rounds[this.counter].backgroundDistraction?.duration);

      }

      if(this.rounds[this.counter].shapeDistractionDuration && this.shapeDistractionOn == undefined && this.distractingShape){
        this.shapeDistractionOn = true;
        this.distractingShape.set('visible', true);
        this.mainCanvas.renderAll();

        setTimeout(() => {
          if(this.distractingShape){
            this.distractingShape.set('visible', false);
            this.shapeDistractionOn = false;
            this.mainCanvas.renderAll();
          }
        }, this.rounds[this.counter].shapeDistractionDuration);
      }
    }
  }

  handleMouseMove(event: MouseEvent): void {
    if (this.hiddenCanvas.isDrawingMode) {
      const pointer = this.mainCanvas.getPointer(event);
      this.hiddenCanvas.freeDrawingBrush.color = this.background == 'red' ? 'blue' : 'red';
      this.hiddenCanvas.freeDrawingBrush.onMouseMove(pointer,{e: true});
    }
    if(!this.clicked && this.trackable){
      this.trackable = false;
      const cursorPosition = this.mainCanvas.getPointer(event);

      if (this.previousCursorPosition) {
        const distance = this.getDistanceBetweenPositions(this.previousCursorPosition, cursorPosition);
        this.cursorPathLength += distance;
      }

      this.previousCursorPosition = cursorPosition;

      this.cursorPositions.push({x: cursorPosition.x, y: cursorPosition.y});
    }
  }

  handleMouseDown(event: MouseEvent): void {
    if(this.startTime != undefined && !this.clicked){
      const timestamp = new Date().getTime() - this.startTime;;
      const position = this.mainCanvas.getPointer(event);
      const shape = this.mainCanvas.findTarget(event, false);
      const misclick = !(!!shape);
      if(misclick){
        this.misclickCount++;
      }
      const distracted = this.backgroundDistractionOn == true || this.shapeDistractionOn == true ? true : false;
      const clickData = { position, timestamp, misclick, distracted };
      this.clicks.push(clickData);
    }
  }

  saveResults(counter: number): void{
    if(this.cursorImageMode != null){
      const imageData = this.hiddenCanvas.toDataURL("image/jpeg", 0.75);
      this.experimentService.saveImage(imageData, this.experimentId, this.participantId, counter).subscribe({
        next: (response) => {
          console.log('Image uploaded to server', response);
        },
        error:(error)  => {
          console.error('Failed to upload image to server', error);
        }
      });

      this.hiddenCanvas.clear();
    }

    let result: Result;
    console.log("saving result")
    console.log(this.participantId);
    if(this.positionTrackingFrequency != null){
      result = {
        experimentId: this.experimentId,
        participantId: this.participantId,
        roundId: this.rounds[counter].roundId,
        roundIdx: this.rounds[counter].roundIdx,
        timeNeeded: this.timeNeeded,
        cursorPathLength: this.cursorPathLength,
        cursorPositions: this.cursorPositions,
        clicks: this.clicks,
        misclickCount: this.misclickCount
      }
    }else{
      result = {
        experimentId: this.experimentId,
        participantId: this.participantId,
        roundId: this.rounds[counter].roundId,
        roundIdx: this.rounds[counter].roundIdx,
        timeNeeded: this.timeNeeded,
        clicks: this.clicks,
        misclickCount: this.misclickCount
      }
    }

    console.log(result)

    this.experimentService.saveResult(result).subscribe({
      next: (response) => {
        console.log('Result uploaded to server', response);
      },
      error:(error)  => {
        console.error('Failed to upload result to server', error); //TODO: handle error
      }
    });
  }

  getDistanceBetweenPositions(position1: Position, position2: Position) {
    const dx = position2.x - position1.x;
    const dy = position2.y - position1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  //TODO: implement rest times
  //TODO: implement practice rounds

}
