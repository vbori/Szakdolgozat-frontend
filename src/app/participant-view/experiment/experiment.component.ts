import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';
import {IRound } from '../../common/models/round.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { Click, Position, Result } from 'src/app/participant-view/models/result.model';
import { ToastrService } from 'ngx-toastr';
import { ResultService } from '../services/result.service';
import { FabricShape } from 'src/app/common/models/shape.model';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})

export class ExperimentComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() experimentId: string = 'expId';
  @Input() demoMode: boolean = false;
  @Input() participantId: string = 'partId';
  @Input() controlMode: boolean = false;
  @Output() finishedExperiment = new EventEmitter();

  //Received from backend
  cursorImageMode: string | undefined = undefined;
  positionTrackingFrequency: number | undefined = undefined;
  background: string | undefined = 'white';
  backgroundFlashColor: string | undefined = 'black';
  distractingBackground: string | undefined ='blue';
  maxCount: number = 0;

  //Fabric.js related
  mainCanvas: fabric.Canvas;
  hiddenCanvas: any;
  distractingShape:  FabricShape | undefined = undefined;

  //Helper variables
  backgroundDistractionOn: boolean | undefined = undefined;
  shapeDistractionOn: boolean | undefined = undefined;
  breakTime: number = 0;
  startedDrawing: boolean = false;
  counter: number = 0;
  targetClicked: boolean = false;
  baseClicked: boolean = false;
  startTime: number | undefined = undefined;
  trackable: boolean = false;
  isBreak: boolean = false;
  positionTracker: ReturnType<typeof setInterval> | undefined = undefined;
  timers:  ReturnType<typeof setInterval>[] = [];
  timeOuts: ReturnType<typeof setTimeout>[] = [];
  lastBaseShapeClick: Position | undefined = undefined;
  previousCursorPosition: Position | undefined = undefined;

  //Result variables
  clicks: Click[] = [];
  misclickCount: number = 0;
  timeNeeded: number = 0;
  cursorPositions: Position[] = [];
  cursorPathLength: number = 0;
  rounds: IRound[] = [];

  constructor(private readonly experimentService: ExperimentService,
              private readonly resultService: ResultService,
              private toastr:ToastrService ) { }

  ngOnInit(): void {
    this.experimentService.getRoundsAndTrackingInfo(this.experimentId).subscribe({
      next: (response) => {
        this.cursorImageMode = response.cursorImageMode;
        this.positionTrackingFrequency = response.positionTrackingFrequency;
        this.rounds = response.rounds;
        this.maxCount = this.rounds.length;
        this.playRound(this.rounds[this.counter]);
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  ngAfterViewInit(): void {
    //Create canvases and set options and event listeners
    this.mainCanvas = new fabric.Canvas('mainCanvas');
    this.mainCanvas.selection = false;
    this.mainCanvas.hoverCursor = 'pointer';

    if(!this.demoMode){
      this.hiddenCanvas = new fabric.Canvas('hiddenCanvas', {containerClass: 'hiddenCanvas'});
      this.hiddenCanvas.selection = false;

      this.mainCanvas.on('mouse:move', ({e}) => this.handleMouseMove(e));
      this.mainCanvas.on('mouse:down', ({e}) => this.handleMouseDown(e));
    }
  }

  ngOnDestroy(): void { //clear all timers and event listeners, dispose canvases
    this.clearTimers();

    this.mainCanvas.forEachObject((obj: any) => {
      this.removeShapeEventHandlers(obj);
    });

    this.removeCanvasEventHandlers(this.mainCanvas);

    if(this.hiddenCanvas){
      this.hiddenCanvas.dispose();
    }

    this.mainCanvas.dispose();
  }

  playRound(round: IRound): void {
    //If the round has a break time, wait for the specified time and then start the round
    if(round.breakTime){
      this.startBreak(round.breakTime);
    }

    setTimeout(() => {
      this.initializeRound();
      this.setBackground(round);
      this.loadMainCanvas(round);
      if(this.cursorImageMode && !this.demoMode){
        this.loadHiddenCanvas(round);
      }
      this.startDistractions();
    }, round.breakTime ? round.breakTime*1000 : 0);
  }

  startBreak(breakTime: number): void {
    this.breakTime = breakTime;
    this.isBreak = true;
    let interval = setInterval(() => {
      this.breakTime -= 1;
      if(this.breakTime <= 0){
        this.isBreak = false;
        clearInterval(interval);
      }
    }, 1000);
    this.timers.push(interval);
  }

  initializeRound(): void { //reset all variables, set start time and start position tracking
    if(this.positionTrackingFrequency && !this.demoMode){
      this.positionTracker = setInterval(() => {
        this.trackable = true;
      }, this.positionTrackingFrequency);
    }
    this.timers = [];
    this.cursorPathLength = 0;
    this.clicks = [];
    this.targetClicked = false;
    this.baseClicked = this.counter > 0 ? true : false;
    this.startedDrawing = false;
    this.misclickCount = 0;
    this.cursorPositions = [];
    this.backgroundDistractionOn = undefined;
    this.shapeDistractionOn = undefined;
    this.startTime = new Date().getTime();
  }

  setBackground(round: IRound): void {
    this.background = round.background;
    this.distractingBackground = round.backgroundDistraction?.color;
    if(round.backgroundDistraction?.flashing?.color){
      this.backgroundFlashColor = round.backgroundDistraction.flashing.color;
    }
  }

  loadMainCanvas(round: IRound): void {
    this.mainCanvas.clear();
    this.mainCanvas.setHeight(round.canvasHeight);
    this.mainCanvas.setWidth(round.canvasWidth);

    this.mainCanvas.loadFromJSON(round, this.mainCanvas.renderAll.bind(this.mainCanvas), (o: any, shape: FabricShape) => {
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
          shape.on('mousedown', ({e}) => this.handleBaseShapeClick(e));
          shape.on('mouseover', this.handleBaseShapeHover.bind(this));
          //shape.on('mouseout', this.handleBaseShapeLeave.bind(this));
        }
      }

      if(shape.flashing){
        let timer = setInterval(() => {
          shape.set('fill', shape.fill == shape.baseColor ? shape.flashing?.color : shape.baseColor);
          this.mainCanvas.renderAll();
        }, shape.flashing.frequency);

        this.timers.push(timer);
      }
    });

  }

  loadHiddenCanvas(round: IRound): void {
    this.hiddenCanvas.setHeight(this.mainCanvas.getHeight());
    this.hiddenCanvas.setWidth(this.mainCanvas.getWidth());

    this.hiddenCanvas.loadFromJSON(round, this.hiddenCanvas.renderAll.bind(this.hiddenCanvas), (o: any, object: FabricShape) => {
      object.set('selectable', false);
      if(!object.distraction){
        if(this.cursorImageMode == 'Outlines only'){
          object.set('fill', 'white');
          object.set('stroke', 'black');
          object.set('strokeWidth', 1);
        }
      }else{
        object.set('visible', false);
      }
    });

    if(this.cursorImageMode == 'Outlines only'){
      this.hiddenCanvas.backgroundColor = 'white';
    }
  }

  startDistractions(): void {
    if(!this.targetClicked && !this.controlMode){
      if(this.rounds[this.counter].backgroundDistraction && this.backgroundDistractionOn == undefined){
        this.startBackgroundDistraction();
      }

      if(this.rounds[this.counter].shapeDistractionDuration && this.shapeDistractionOn == undefined && this.distractingShape){
        this.startShapeDistraction();
      }
    }
  }


  handleBaseShapeClick(event: MouseEvent): void {
    if (this.targetClicked) { //If round is finished, reset timers, canvases and event listeners, and start next round

      this.lastBaseShapeClick = this.mainCanvas.getPointer(event);

      if(this.cursorImageMode && !this.demoMode){
        this.hiddenCanvas.clear();
        this.hiddenCanvas.isDrawingMode = true;
        this.hiddenCanvas.freeDrawingBrush = new fabric.PencilBrush(this.hiddenCanvas);
      }

      this.clearTimers();

      for(let shape of this.mainCanvas.getObjects()){
        this.removeShapeEventHandlers(shape);
      }

      this.counter++;

      if (this.counter < this.maxCount) {
        this.playRound(this.rounds[this.counter]);
      } else {
        this.mainCanvas.clear();
        this.finishedExperiment.emit();
        return
      }
    }else{
      this.baseClicked = true;
    }
  }

  handleTargetShapeClick(): void { //If target shape is clicked, save measurements
    if(this.baseClicked && !this.targetClicked){
      this.targetClicked = true;
      if(this.startTime != undefined){
        this.timeNeeded = new Date().getTime() - this.startTime;
      }

      if(this.positionTracker){
        clearInterval(this.positionTracker);
      }

      if(this.cursorImageMode && !this.demoMode &&this.hiddenCanvas.isDrawingMode){
        this.hiddenCanvas.freeDrawingBrush._finalizeAndAddPath();
        this.hiddenCanvas.isDrawingMode = false;
      }

      if(!this.demoMode){
        this.saveResults(this.counter);
      }
    }
  }

  handleBaseShapeHover(): void { //When cursor hovers over base shape, start drawing on hidden canvas
    if(!this.targetClicked){
      if(this.cursorImageMode && !this.demoMode && !this.hiddenCanvas.isDrawingMode){
        this.hiddenCanvas.isDrawingMode = true;
        this.hiddenCanvas.freeDrawingBrush = new fabric.PencilBrush(this.hiddenCanvas);
      }
    }
  }

  /*handleBaseShapeLeave(): void { //When cursor leaves base shape, start background and shape distractions
    if(!this.targetClicked && !this.controlMode){
      if(this.rounds[this.counter].backgroundDistraction && this.backgroundDistractionOn == undefined){
        this.startBackgroundDistraction();
      }

      if(this.rounds[this.counter].shapeDistractionDuration && this.shapeDistractionOn == undefined && this.distractingShape){
        this.startShapeDistraction();
      }
    }
  }*/

  handleMouseMove(event: MouseEvent): void { //When cursor moves, draw on hidden canvas and track cursor position and path length
    if(this.hiddenCanvas.isDrawingMode) {
      if(!this.startedDrawing && this.counter > 0){
        this.hiddenCanvas.freeDrawingBrush.onMouseMove(this.lastBaseShapeClick,{e: true});
        this.startedDrawing = true;
      }
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
    if(this.startTime != undefined && !this.targetClicked){ //Clicks are only tracked until the target shape is clicked
      const timestamp = new Date().getTime() - this.startTime;;
      const position = this.mainCanvas.getPointer(event);
      const shape = this.mainCanvas.findTarget(event, false) as FabricShape;
      const misclick = !(!!shape) || (shape && !shape.target);
      if(misclick){
        this.misclickCount++;
      }
      const distracted = this.backgroundDistractionOn == true || this.shapeDistractionOn == true ? true : false;
      const clickData = { position, timestamp, misclick, distracted };
      this.clicks.push(clickData);
    }
  }

  startBackgroundDistraction(): void {
    this.backgroundDistractionOn = true;
    this.mainCanvas.backgroundColor = this.distractingBackground;
    this.mainCanvas.renderAll();

    let interval:  ReturnType<typeof setInterval> | undefined = undefined;
    if(this.rounds[this.counter].backgroundDistraction?.flashing){
      interval = setInterval(() => {
        this.mainCanvas.backgroundColor = this.mainCanvas.backgroundColor == this.distractingBackground ? this.backgroundFlashColor : this.distractingBackground;
        this.mainCanvas.renderAll();
      }, this.rounds[this.counter].backgroundDistraction?.flashing?.frequency);
      this.timers.push(interval);
    }

    let timeout = setTimeout(() => {
      if(interval){
        clearInterval(interval);
      }
      this.backgroundDistractionOn = false;
      this.mainCanvas.backgroundColor = this.background;
      this.mainCanvas.renderAll();
    }, this.rounds[this.counter].backgroundDistraction?.duration);
    this.timeOuts.push(timeout);
  }

  startShapeDistraction(): void {
    if(this.distractingShape){
      this.shapeDistractionOn = true;
      this.distractingShape.set('visible', true);
      this.mainCanvas.renderAll();

      let timeout = setTimeout(() => {
        if(this.distractingShape){
          this.distractingShape.set('visible', false);
          this.shapeDistractionOn = false;
          this.mainCanvas.renderAll();
        }
      }, this.rounds[this.counter].shapeDistractionDuration);
      this.timeOuts.push(timeout);
    }
  }

  saveResults(counter: number): void {
    if(this.cursorImageMode){
      this.saveImage(counter);
    }

    const result: Result = {
        experimentId: this.experimentId,
        participantId: this.participantId,
        roundId: this.rounds[counter]._id,
        roundIdx: this.rounds[counter].roundIdx,
        timeNeeded: this.timeNeeded,
        cursorPathLength: this.positionTrackingFrequency ? this.cursorPathLength: undefined,
        cursorPositions: this.positionTrackingFrequency ? this.cursorPositions: undefined,
        clicks: this.clicks,
        misclickCount: this.misclickCount
      };

    this.resultService.saveResult(result).subscribe({
      next: () => {
        console.log('Result uploaded to server');
      },
      error:(error)  => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  saveImage(counter: number): void {
    const imageData = this.hiddenCanvas.toDataURL("image/jpeg", 0.75);
    this.resultService.saveImage(imageData, this.experimentId, this.participantId, counter+1).subscribe({
      next: () => {
        console.log('Image uploaded to server');
      },
      error:(error)  => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }

  getDistanceBetweenPositions(position1: Position, position2: Position): number {
    const dx = position2.x - position1.x;
    const dy = position2.y - position1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  removeShapeEventHandlers(shape: FabricShape): void {
    shape.off('mousedown');
    shape.off('mouseover');
    shape.off('mouseout');
  }

  removeCanvasEventHandlers(canvas: fabric.Canvas): void {
    canvas.off('mouse:move');
    canvas.off('mouse:down');
  }

  clearTimers(): void {
    for(let timer of this.timers){
      clearInterval(timer);
    }

    for(let timer of this.timeOuts){
      clearTimeout(timer);
    }

    if(this.positionTracker){
      clearInterval(this.positionTracker);
    }
  }

}
