import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { fabric } from 'fabric';
import { MatSelectChange } from '@angular/material/select';
import { ShapeService } from 'src/app/researcher-view/services/shape.service';
import { ExperimentCreationConstants } from 'src/app/researcher-view/create-experiment/experiment-creation.constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { markControlsTouched } from 'src/app/researcher-view/utils/formUtils';
import { ShapeType, FabricShape, Flashing } from 'src/app/common/models/shape.model';
import { Subscription } from 'rxjs';

interface ShapeOption {
  value: ShapeType;
  viewValue: string;
}

@Component({
  selector: 'app-shape-form',
  templateUrl: './shape-form.component.html',
  styleUrls: ['./shape-form.component.scss']
})

export class ShapeFormComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() shape: FabricShape;
  @Input() canvas: fabric.Canvas;
  @Input() index: number = 0;
  @Input() shapesIntersect: boolean = false;
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() shapesIntersectChange = new EventEmitter<boolean>();
  @Output() shapeSelected = new EventEmitter<number>();
  @Output() shapeChange = new EventEmitter<FabricShape>();

  shapeOptions: ShapeOption[] = [
    {value: 'rect', viewValue: 'Rectangle'},
    {value: 'circle', viewValue: 'Circle'}
  ];

  subscriptions: Subscription[] = [];

  shapeConfigForm = new FormGroup({
    type: new FormControl<string>('circle', {validators: [Validators.required]}),
    radius: new FormControl<number>(25, {validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE / 2), Validators.max(this.constants.MAX_SHAPE_SIZE / 2), Validators.pattern("^[0-9]*(.[5|0])?$")]}),
    left: new FormControl<number>(100, {validators: [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]}),
    top: new FormControl<number>(100, {validators: [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]}),
    width: new FormControl<number>(50, {validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE), Validators.pattern("^[0-9]*$")]}),
    height: new FormControl<number>(50, {validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE), Validators.pattern("^[0-9]*$")]}),
    fill: new FormControl<string>('blue', {validators: [Validators.required]}),
    useFlashing: new FormControl<boolean>(false),
    flashing: new FormGroup({
      color: new FormControl<string>('#000000', {validators: [Validators.required]}),
      frequency: new FormControl<number>(500, {validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY), Validators.pattern("^[0-9]*$")]}),
    })
  });

  constructor(private shapeService: ShapeService, public constants: ExperimentCreationConstants){}

  ngOnInit(): void {
      this.initializeForm();
      this.addEventHandlers(this.shape);
  }

  ngAfterViewInit(): void {
    let subscription = this.shapeConfigForm.statusChanges?.subscribe((status) => {
      this.validityChange.emit(status === 'VALID');
    });

    if(subscription){
      this.subscriptions.push(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  initializeForm(): void{
    this.shapeConfigForm.controls.left.addValidators([this.checkLimits('left')]);
    this.shapeConfigForm.controls.top.addValidators([this.checkLimits('top')]);
    this.shapeConfigForm.controls.width.setValue(this.shape.width ? Math.round(this.shape.getScaledWidth()) : 50);
    this.shapeConfigForm.controls.height.setValue(this.shape.height ? Math.round(this.shape.getScaledHeight()) : 50);
    this.shapeConfigForm.controls.left.setValue(this.shape.left ? Math.floor(this.shape.left) : 100);
    this.shapeConfigForm.controls.top.setValue(this.shape.top ? Math.floor(this.shape.top) : 100);
    this.shapeConfigForm.controls.fill.setValue(this.shape.fill ? this.shape.fill as string : 'blue');
    //this.shapeConfigForm.controls.radius.setValue(this.shape.radius ? Math.round(this.shape.getScaledWidth()/2) : 25);
    this.shapeConfigForm.controls.radius.setValue(this.shape.radius ? Math.round(this.shape.getScaledWidth())/2 : 25);
    this.shapeConfigForm.controls.type.setValue(this.shape.type ? this.shape.type : 'circle');
    this.shapeConfigForm.controls.useFlashing.setValue(this.shape.flashing ? true : false);
    this.shapeConfigForm.controls.flashing.controls.color.setValue(this.shape.flashing ? this.shape.flashing.color : '#000000');
    this.shapeConfigForm.controls.flashing.controls.frequency.setValue(this.shape.flashing ? this.shape.flashing.frequency : 500);
    markControlsTouched(this.shapeConfigForm);
  }

  addEventHandlers(shape: FabricShape): void{
    shape.on('scaling', this.handleObjectScaling.bind(this));
    shape.on('moving', this.handleObjectMoving.bind(this));
    shape.on('selected', this.handleObjectSelected.bind(this));
  }

  onTypeChange(event: MatSelectChange): void{
    const shape = this.shapeService.changeShapeType(event.value, this.shape);
    if(shape){
      this.addEventHandlers(shape);
      this.canvas.remove(this.shape);
      this.shape = shape;
      this.canvas.add(this.shape);
      this.canvas.renderAll();
      this.initializeForm();
      this.shapeChange.emit(this.shape);
    }
  }

  onRadiusChange(event: Event): void{
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if(this.shapeConfigForm.controls.radius.valid && value <= this.constants.MAX_SHAPE_SIZE / 2 && value >= this.constants.MIN_SHAPE_SIZE / 2){
      const newScale = this.shape.radius ? value / this.shape.radius : value;
      this.shape.set('scaleX', newScale);
      this.shape.set('scaleY', newScale);
    }
    this.shape.setCoords();
    this.handleObjectMoving();
  }

  handleObjectScaling(): void{
    if(this.shape.getScaledWidth() > this.constants.MAX_SHAPE_SIZE){
      const newScaleX = this.shape.width ? this.constants.MAX_SHAPE_SIZE / this.shape.width : this.constants.MAX_SHAPE_SIZE;
      this.shape.set('scaleX', newScaleX);
    }else if(this.shape.getScaledWidth() < this.constants.MIN_SHAPE_SIZE){
      const newScaleX = this.shape.width ? this.constants.MIN_SHAPE_SIZE / this.shape.width : this.constants.MIN_SHAPE_SIZE;
      this.shape.set('scaleX', newScaleX);
    }

    if(this.shape.getScaledHeight() > this.constants.MAX_SHAPE_SIZE){
      const newScaleY = this.shape.height ? this.constants.MAX_SHAPE_SIZE / this.shape.height : this.constants.MAX_SHAPE_SIZE;
      this.shape.set('scaleY', newScaleY);
    }else if(this.shape.getScaledHeight() < this.constants.MIN_SHAPE_SIZE){
      const newScaleY = this.shape.height ? this.constants.MIN_SHAPE_SIZE / this.shape.height : this.constants.MIN_SHAPE_SIZE;
      this.shape.set('scaleY', newScaleY);
    }

    this.shape.setCoords();

    this.shapeConfigForm.controls.width.setValue(Math.round(this.shape.getScaledWidth()));
    this.shapeConfigForm.controls.height.setValue(Math.round(this.shape.getScaledHeight()));
    //this.shapeConfigForm.controls.radius.setValue(Math.round((this.shape.getScaledWidth() / 2.0)));
    this.shapeConfigForm.controls.radius.setValue(Math.round(this.shape.getScaledWidth()) / 2.0);
    this.shapeConfigForm.controls.width.markAsDirty();
    this.shapeConfigForm.controls.height.markAsDirty();
    this.shapeConfigForm.controls.radius.markAsDirty();
    this.handleObjectMoving();
  }

  handleObjectMoving(): void{
    if(this.shape.left){
      if(this.shape.left > this.canvas.getWidth() - this.shape.getScaledWidth() ){
        this.shape.set('left', Math.floor(this.canvas.getWidth() - this.shape.getScaledWidth()));
      }else if(this.shape.left < 0){
        this.shape.set('left', 0);
      }
      this.shapeConfigForm.controls.left.setValue(Math.floor(this.shape.left));
      this.shapeConfigForm.controls.left.markAsDirty();
    }

    if(this.shape.top){
      if(this.shape.top > this.canvas.getHeight() - this.shape.getScaledHeight()){
        this.shape.set('top', Math.floor(this.canvas.getHeight() - this.shape.getScaledHeight()));
      }else if(this.shape.top < 0){
        this.shape.set('top', 0);
      }
      this.shapeConfigForm.controls.top.setValue(Math.floor(this.shape.top));
      this.shapeConfigForm.controls.top.markAsDirty();
    }
    this.shape.setCoords();
    this.canvas.renderAll();
    this.checkIntersection();
  }

  checkIntersection(): void{
    this.shape.setCoords();
    this.shapesIntersect = false;
    this.shapesIntersectChange.emit(false);
    this.canvas.forEachObject( (obj) => {
      if (obj === this.shape || !obj.visible) return;
      if(this.shape.intersectsWithObject(obj)){
        this.shapesIntersect = true;
        this.shapesIntersectChange.emit(true);
      }
    });
  }

  handleObjectSelected(): void{
    this.shapeSelected.emit(this.index);
  }

  setObjectAttribute(attribute: keyof FabricShape, value: string) :void {
    if(attribute === 'fill'){
      this.shape.set(attribute, value);
    }else{
      const {minLimit, maxLimit} = this.getLimits(attribute);
      if(minLimit != undefined && maxLimit != undefined && parseFloat(value) <= maxLimit && parseFloat(value) >= minLimit){
        if(attribute === 'width'){
          const newScaleX = this.shape.width ? parseFloat(value) / this.shape.width : parseFloat(value);
          this.shape.set('scaleX', newScaleX);
          this.handleObjectMoving();
        }else if(attribute === 'height'){
          const newScaleY = this.shape.height ? parseFloat(value) / this.shape.height : parseFloat(value);
          this.shape.set('scaleY', newScaleY);
          this.handleObjectMoving();
        }else{
        this.shape.set(attribute, parseFloat(value));
        }
      }
    }
    this.canvas.renderAll();
  }

  getLimits(attribute: string): {minLimit: number | undefined, maxLimit: number | undefined}{
    let minLimit;
    let maxLimit;
    switch(attribute){
      case 'width':
      case 'height':
        minLimit = this.constants.MIN_SHAPE_SIZE;
        maxLimit = this.constants.MAX_SHAPE_SIZE;
        break;
      case 'left':
        minLimit = 0;
        maxLimit = this.canvas.getWidth() - this.shape.getScaledWidth();
        break;
      case 'top':
        minLimit = 0;
        maxLimit = this.canvas.getHeight() - this.shape.getScaledHeight();
        break;
      case 'frequency':
        minLimit = this.constants.MIN_FLASHING_FREQUENCY;
        maxLimit = this.constants.MAX_FLASHING_FREQUENCY;
        break;
      default:
        break;
    }

    return {minLimit, maxLimit};
  }


  checkLimits (attribute: keyof FabricShape): ValidatorFn {
    return (control: AbstractControl):  ValidationErrors | null => {
      const {minLimit, maxLimit} = this.getLimits(attribute);
      return (minLimit != undefined && maxLimit != undefined && parseFloat(control.value) <= maxLimit && parseFloat(control.value) >= minLimit) || minLimit == undefined || maxLimit == undefined  ? null : { overLimit: true }
    }
  }

  setFlashing(event: MatCheckboxChange): void{
    if(event.checked){
      this.shape.set('flashing', {color: this.shapeConfigForm.value.flashing?.color ?? '#000000', frequency: this.shapeConfigForm.value.flashing?.frequency ?? 500});
      this.shapeConfigForm.controls.flashing?.enable();
    }else{
      this.shape.set('flashing', undefined);
      this.shapeConfigForm.controls.flashing?.disable();
    }
  }

  changeFlashing(attribute: keyof Flashing, value: string): void{
    if(this.shape.flashing){
      if(attribute === 'color'){
        this.shape.flashing.color = value;
      }else if(attribute === 'frequency'){
        const {minLimit, maxLimit} = this.getLimits(attribute);
        if(minLimit != undefined && maxLimit != undefined && parseFloat(value) <= maxLimit && parseFloat(value) >= minLimit){
          this.shape.flashing.frequency = Math.floor(parseInt(value));
        }
      }
    }
  }
}
