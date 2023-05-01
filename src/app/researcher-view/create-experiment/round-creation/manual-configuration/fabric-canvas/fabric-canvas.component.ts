import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fabric } from 'fabric';
import { FabricShape, Round } from 'src/app/common/models/round.model';
import { ExperimentCreationConstants } from '../../../experiment-creation.constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements AfterViewInit, OnChanges{
  @Input() canvasWidth: number;
  @Input() canvasHeight: number;
  @Input() roundIdx: number;
  @Input() round: Round;

  @Output() validityChange = new EventEmitter<boolean>();
  @Output() canvasCreated = new EventEmitter<fabric.Canvas>();

  canvas: fabric.Canvas;
  distractingShape: FabricShape | undefined = undefined;
  targetShape: FabricShape | undefined = undefined;
  baseShape: FabricShape | undefined = undefined;
  shapesIntersect = false;
  validities = {targetShape: true, distractingShape: true, baseShape: true};
  tabLabels = ['Base Shape', 'Target Shape', 'Distracting Shape'];
  selectedTabIndex = 0;

  distractionForm = new FormGroup({
    backgroundColor: new FormControl<string>('#FFFFFF', {nonNullable: true, validators: [Validators.required]}),
    useBackgroundDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    useShapeDistraction: new FormControl<boolean>(false, {nonNullable: true}),
    shapeDistractionDuration: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME),Validators.pattern("^[0-9]*$")]}),
    backgroundDistraction : new FormGroup({
      color: new FormControl<string>('#FF0000',{nonNullable: true, validators: [Validators.required]}),
      duration: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_DISTRACTION_DURATION_TIME), Validators.pattern("^[0-9]*$")]}),
      useFlashing: new FormControl<boolean>(false, {nonNullable: true}),
      flashing: new FormGroup({
        color: new FormControl<string>('#000000',{nonNullable: true, validators: [Validators.required]}),
        frequency: new FormControl<number>(500, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY),Validators.pattern("^[0-9]*$")]}),
      })
    })
  });

  constructor(private changeDetector: ChangeDetectorRef, public constants: ExperimentCreationConstants) { }

  ngAfterViewInit(): void {
    this.distractionForm.statusChanges?.subscribe((status) => {
      let allValid = status === 'VALID' && this.validities.baseShape && this.validities.targetShape && (this.distractionForm.value.useShapeDistraction ? this.validities.distractingShape : true);
      this.validityChange.emit(allValid);
    });

    this.initializeCanvas();
    this.initializeForm();
    console.log(this.round);
    if(this.round.objects.length > 0){
      let distractingShape = this.round.objects.filter((obj) => obj.distraction).at(0);
      if(!distractingShape){
        distractingShape = this.CANVASDATA.objects.filter((obj) => obj.distraction).at(0);
        if(distractingShape)
          this.round.objects.push(distractingShape);
      }
      this.loadCanvasData(this.round);
    }else{
      this.loadCanvasData(this.CANVASDATA);
    }
    this.canvas.renderAll();
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.canvas){
      if('canvasWidth' in changes ){
        this.handleCanvasWidthChange();
      }

      if('canvasHeight' in changes){
        this.handleCanvasHeightChange();
      }
      this.canvas.renderAll();
    }
  }

  initializeCanvas(): void{
    this.canvas = new fabric.Canvas(`canvas${this.roundIdx}`);
    this.canvas.setHeight(this.canvasHeight);
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.backgroundColor =  this.distractionForm.controls.backgroundColor.value;
    this.canvas.selection = false;
    this.canvasCreated.emit(this.canvas);
  }

  initializeForm(): void{
    this.distractionForm.patchValue(this.round);
    this.distractionForm.controls.useBackgroundDistraction.setValue(!!this.round.backgroundDistraction);
    this.distractionForm.controls.useShapeDistraction.setValue(!!this.round.shapeDistractionDuration);
  }

  loadCanvasData(round: Round): void{
    if(this.canvas)
    this.canvas.loadFromJSON(round, this.canvas.renderAll.bind(this.canvas), (o: any, shape: any) => {
      shape.setControlsVisibility({ mtr: false });
      shape.set('noScaleCache', false);
      if(shape.type === 'circle') {
        shape.setControlsVisibility({mr: false, ml: false, mt: false, mb: false});
      }
      if(shape.distraction) {
        if(this.round.shapeDistractionDuration == undefined)
        shape.set('visible', false);
        this.distractingShape = shape;
      }else  if(shape.target) {
        this.targetShape = shape;
      }else {
        this.baseShape = shape;
      }
    });
  }

  handleCanvasWidthChange(): void{
    if(this.canvasWidth <= this.constants.MAX_CANVAS_HEIGHT && this.canvasWidth >= this.constants.MIN_CANVAS_WIDTH){
      this.canvas.setWidth(this.canvasWidth);

      this.canvas.forEachObject((shape) => {
        if(shape.left && shape.width && shape.left + shape.width > this.canvasWidth){
          shape.set('left', this.canvasWidth - shape.width);
          this.canvas.renderAll();
        }
      })
    }
  }

  handleCanvasHeightChange(): void{
    if(this.canvasHeight <= this.constants.MAX_CANVAS_HEIGHT && this.canvasHeight >= this.constants.MIN_CANVAS_HEIGHT){
      this.canvas.setHeight(this.canvasHeight);

      this.canvas.forEachObject((shape) => {
        if(shape.top && shape.height && shape.top + shape.height > this.canvasHeight){
          shape.set('top', this.canvasHeight - shape.height);
          this.canvas.renderAll();
        }
      })
    }
  }

  setBackgroundFlashing(event: MatCheckboxChange): void{
    if(event.checked){
      this.distractionForm.controls.backgroundDistraction.controls.flashing?.enable();
      if(this.round.backgroundDistraction)
      this.round.backgroundDistraction.flashing = {
        color: this.distractionForm.controls.backgroundDistraction.controls.flashing?.controls.color.value,
        frequency: this.distractionForm.controls.backgroundDistraction.controls.flashing?.controls.frequency.value
      }
    }else{
      this.distractionForm.controls.backgroundDistraction.controls.flashing?.disable();
      if(this.round.backgroundDistraction)
      this.round.backgroundDistraction.flashing = undefined;
    }
  }

  setBackgroundDistraction(event: MatCheckboxChange): void{
    if(event.checked){
      this.distractionForm.controls.backgroundDistraction.enable();
      this.round.backgroundDistraction = {
        color: this.distractionForm.controls.backgroundDistraction.controls.color.value,
        duration: this.distractionForm.controls.backgroundDistraction.controls.duration.value,
        flashing: this.distractionForm.controls.backgroundDistraction.controls.useFlashing.value ? {
          color: this.distractionForm.controls.backgroundDistraction.controls.flashing?.controls.color.value,
          frequency: this.distractionForm.controls.backgroundDistraction.controls.flashing?.controls.frequency.value
        } : undefined
      }
    }else{
      this.distractionForm.controls.backgroundDistraction.disable();
      this.round.backgroundDistraction = undefined;
    }
  }

  setShapeDistraction(event: MatCheckboxChange): void{ 
    if(event.checked){
      this.distractionForm.controls.shapeDistractionDuration.enable();
      this.round.shapeDistractionDuration = this.distractionForm.controls.shapeDistractionDuration.value;
      this.distractingShape?.set('visible', true);
      if(this.distractingShape){
        this.canvas.setActiveObject(this.distractingShape);
        this.distractingShape.setCoords();
        this.selectedTabIndex = 2;
      }
    }else{
      this.distractionForm.controls.shapeDistractionDuration.disable();
      this.round.shapeDistractionDuration = undefined;
      this.canvas.discardActiveObject(); 
      this.distractingShape?.set('visible', false);
    }
    this.checkIntersection();
    this.canvas.renderAll();
  }

  checkIntersection() {
    if(this.distractingShape){
      this.shapesIntersect = false;
      let comparisonShape = this.distractingShape.visible ? this.distractingShape : this.targetShape;
      this.canvas.forEachObject( (obj) => {
        if (obj === comparisonShape || !obj.visible) return;
        if(comparisonShape?.intersectsWithObject(obj)){
          this.shapesIntersect = true;
          this.validityChange.emit(false); 
        }
      });
    }
  }

  onBackgroundChange(): void{
    this.canvas.backgroundColor = this.distractionForm.controls.backgroundColor.value;
    this.round.background = this.distractionForm.controls.backgroundColor.value;
    this.canvas.renderAll();
  }

  changeBackgroundDistractionDuration(): void{
    if(this.round.backgroundDistraction){
      this.round.backgroundDistraction.duration = this.distractionForm.controls.backgroundDistraction.controls.duration.value;
    }
    console.log(this.round);
  }

  changeBackgroundDistractionColor(): void{
    if(this.round.backgroundDistraction){
      this.round.backgroundDistraction.color = this.distractionForm.controls.backgroundDistraction.controls.color.value;
    }
    console.log(this.round);
  }

  changeBackgroundDistractionFlashingColor(): void{
    if(this.round.backgroundDistraction?.flashing){
      this.round.backgroundDistraction.flashing.color = this.distractionForm.controls.backgroundDistraction.controls.flashing?.controls.color.value;
    }
    console.log(this.round);
  }

  changeBackgroundDistractionFlashingFrequency(): void{
    if(this.round.backgroundDistraction?.flashing){
      this.round.backgroundDistraction.flashing.frequency = this.distractionForm.controls.backgroundDistraction.controls.flashing?.controls.frequency.value;
    }
    console.log(this.round);
  }

  changeShapeDistractionDuration(): void{
    this.round.shapeDistractionDuration = this.distractionForm.controls.shapeDistractionDuration.value;
    console.log(this.round);
  }

  changeSelectedObject(event: MatTabChangeEvent){
    if(event.tab.textLabel == this.tabLabels[0] && this.baseShape){
      this.canvas.setActiveObject(this.baseShape);
    }else if(event.tab.textLabel == this.tabLabels[1] && this.targetShape){
      this.canvas.setActiveObject(this.targetShape);
    }else if(event.tab.textLabel == this.tabLabels[2] && this.distractingShape){
      this.canvas.setActiveObject(this.distractingShape);
    }

    this.canvas.renderAll();
  }

  onValidityChange(valid: boolean, shapeName: 'baseShape' | 'targetShape' | 'distractingShape'): void{
    this.validities[shapeName] = valid;
    let allValid = !this.shapesIntersect && this.validities.baseShape && this.validities.targetShape && (this.distractionForm.value.useShapeDistraction ? this.validities.distractingShape : true);
    this.validityChange.emit(allValid);
  }

  onIntersectChange(intersect: boolean){
    this.shapesIntersect = intersect;
    let allValid = !this.shapesIntersect && this.validities.baseShape && this.validities.targetShape && (this.distractionForm.value.useShapeDistraction ? this.validities.distractingShape : true);
    this.validityChange.emit(allValid);
  }

  readonly CANVASDATA: Round = {
    "objects": [
      {
        "type": "circle",
        "originX": "left",
        "originY": "top",
        "left": 40,
        "top": 40,
        "width": 50,
        "height": 50,
        "radius": 25,
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
    ],
    "background": "#ffffff",
    "canvasHeight": 600,
    "canvasWidth": 600
  }
}
