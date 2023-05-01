import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';
import {Round, FabricShape} from '../../common/models/round.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { Click, Position, Result } from 'src/app/common/models/result.model';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})

export class ExperimentComponent implements OnInit{
  @Input() experimentId: string;
  @Input() demoMode: boolean;
  @Input() participantId: string;
  @Input() controlMode: boolean;
  @Output() finishedExperiment = new EventEmitter();

  cursorImageMode: string | undefined = undefined;
  positionTrackingFrequency: number | undefined = undefined;

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
  targetClicked: boolean = false;
  startTime: number | undefined = undefined;
  trackable: boolean = false;
  positionTracker: any = undefined;
  previousCursorPosition: Position | undefined = undefined;

  clicks: Click[] = [];
  misclickCount: number = 0;
  timeNeeded: number;
  cursorPositions: Position[] = [];
  cursorPathLength: number = 0;
  rounds: Round[];

  constructor(private readonly experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.experimentService.getRoundsAndTrackingInfo(this.experimentId).subscribe({
      next: (response) => {
        console.log(response.rounds);
        this.cursorImageMode = response.cursorImageMode;
        console.log("cursorImageMode",this.cursorImageMode)
        this.positionTrackingFrequency = response.positionTrackingFrequency;
        this.rounds = response.rounds;
        this.maxCount = this.rounds.length;
        this.playRound(this.rounds[this.counter]);
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
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

  playRound(round: Round): void {
    this.initializeRound();
    this.setBackground(round);
    this.loadMainCanvas(round);
    if(this.cursorImageMode){
      this.loadHiddenCanvas(round);
    }
  }

  initializeRound(): void{
    if(this.positionTrackingFrequency){
      this.positionTracker = setInterval(() => {
        this.trackable = true;
      }, this.positionTrackingFrequency);
    }
    this.cursorPathLength = 0;
    this.clicks = [];
    this.targetClicked = false;
    this.misclickCount = 0;
    this.cursorPositions = [];
    this.backgroundDistractionOn = undefined;
    this.shapeDistractionOn = undefined;
    this.startTime = new Date().getTime();
  }

  setBackground(round: Round): void{
    this.background = round.background;
    this.distractingBackground = round.backgroundDistraction?.color;
    if(round.backgroundDistraction?.flashing?.color){
      this.backgroundFlashColor = round.backgroundDistraction.flashing.color;
    }
  }

  loadMainCanvas(round: Round): void{
    this.mainCanvas.clear();
    this.mainCanvas.setHeight(round.canvasHeight);
    this.mainCanvas.setWidth(round.canvasWidth);

    this.mainCanvas.loadFromJSON(round, this.mainCanvas.renderAll.bind(this.mainCanvas), (o: any, shape: any) => {
      shape.set('selectable', false);
      shape.set('perPixelTargetFind',true);

      if(shape.distraction){
        shape.set('visible', false);
        shape.set('evented', false);
        this.distractingShape = shape;
      }else{
        if(shape.target){
          shape.on('mousedown', this.handleTargetShapeClick.bind(this));
        }else{
          shape.on('mousedown', this.handleBaseShapeClick.bind(this));
          shape.on('mouseover', this.handleBaseShapeHover.bind(this));
          shape.on('mouseout', this.handleBaseShapeLeave.bind(this));
        }
      }

      if(shape.flashing){
        setInterval(() => {
          shape.set('fill', shape.fill == shape.baseColor ? shape.flashing.color : shape.baseColor);
          this.mainCanvas.renderAll();
        }, shape.flashing.frequency);
      }
    });

  }

  loadHiddenCanvas(round: Round): void{
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
    if (this.targetClicked) {
      if(!this.demoMode){
        this.saveResults(this.counter);
      }

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
    this.targetClicked = true;
    if(this.startTime != undefined){
      this.timeNeeded = new Date().getTime() - this.startTime;
    }

    if(this.positionTracker){
      clearInterval(this.positionTracker);
    }

    if(this.cursorImageMode){
      this.hiddenCanvas.freeDrawingBrush._finalizeAndAddPath();
      this.hiddenCanvas.isDrawingMode = false;
    }
  }

  handleBaseShapeHover(): void {
    if(!this.targetClicked){
      if(this.cursorImageMode && !this.hiddenCanvas.isDrawingMode){
        this.hiddenCanvas.isDrawingMode = true;
        this.hiddenCanvas.freeDrawingBrush = new fabric.PencilBrush(this.hiddenCanvas);
      }
    }
  }

  handleBaseShapeLeave(): void {
    if(!this.targetClicked && !this.controlMode){
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
    if(!this.targetClicked && this.trackable){
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
    if(this.startTime != undefined && !this.targetClicked){
      const timestamp = new Date().getTime() - this.startTime;;
      const position = this.mainCanvas.getPointer(event);
      const shape = this.mainCanvas.findTarget(event, false) as FabricShape;
      const misclick = !(!!shape) || (shape && !shape.target && !this.targetClicked);
      if(misclick){
        this.misclickCount++;
      }
      const distracted = this.backgroundDistractionOn == true || this.shapeDistractionOn == true ? true : false;
      const clickData = { position, timestamp, misclick, distracted };
      this.clicks.push(clickData);
    }
  }

  saveResults(counter: number): void{
    if(this.cursorImageMode){
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
    if(this.positionTrackingFrequency){
      result = {
        experimentId: this.experimentId,
        participantId: this.participantId,
        roundId: this.rounds[counter]._id,
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
        roundId: this.rounds[counter]._id,
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
}
