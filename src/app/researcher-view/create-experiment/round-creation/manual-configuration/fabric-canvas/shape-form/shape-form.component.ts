import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FabricShape } from 'src/app/common/models/newRound.model';
import { fabric } from 'fabric';
import { MatSelectChange } from '@angular/material/select';
import { ShapeService } from 'src/app/researcher-view/services/shape.service';
import { ExperimentCreationConstants } from 'src/app/researcher-view/create-experiment/experiment-creation.constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Flashing } from 'src/app/common/models/newRound.model';

interface ShapeType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-shape-form',
  templateUrl: './shape-form.component.html',
  styleUrls: ['./shape-form.component.scss']
})

export class ShapeFormComponent implements OnInit, AfterViewInit{
  @Input() role: string;
  @Input() shape: FabricShape;
  @Input() canvas: fabric.Canvas;
  @Output() validityChange = new EventEmitter<boolean>();

  shapeTypes: ShapeType[] = [
    {value: 'rect', viewValue: 'Rectangle'},
    {value: 'circle', viewValue: 'Circle'}
  ];

  shapeConfigForm = new FormGroup({
    type: new FormControl<string>('circle', {validators: [Validators.required]}),
    radius: new FormControl<number>(25, {validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE / 2), Validators.max(this.constants.MAX_SHAPE_SIZE / 2)]}),
    left: new FormControl<number>(100, {validators: [Validators.required, Validators.min(0)]}),
    top: new FormControl<number>(100, {validators: [Validators.required, Validators.min(0)]}),
    width: new FormControl<number>(50, {validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
    height: new FormControl<number>(50, {validators: [Validators.required, Validators.min(this.constants.MIN_SHAPE_SIZE), Validators.max(this.constants.MAX_SHAPE_SIZE)]}),
    fill: new FormControl<string>('blue', {validators: [Validators.required]}),
    useFlashing: new FormControl<boolean>(false),
    flashing: new FormGroup({
      color: new FormControl<string>('#000000', {validators: [Validators.required]}),
      frequency: new FormControl<number>(500, {validators: [Validators.required, Validators.min(this.constants.MIN_FLASHING_FREQUENCY), Validators.max(this.constants.MAX_FLASHING_FREQUENCY)]}),
    })
  });

  constructor(private shapeService: ShapeService, public constants: ExperimentCreationConstants){}

  ngOnInit(): void {
      this.initializeForm();
      this.addEventHandlers(this.shape);
  }

  ngAfterViewInit(): void {
    this.shapeConfigForm.statusChanges?.subscribe((status) => {
      this.validityChange.emit(status === 'VALID');
    });
  }

  initializeForm(): void{
    this.shapeConfigForm.controls.left.addValidators([this.checkLimits('left')]);
    this.shapeConfigForm.controls.top.addValidators([this.checkLimits('top')]);
    this.shapeConfigForm.controls.width.setValue(this.shape.width ? this.shape.width : 50);
    this.shapeConfigForm.controls.height.setValue(this.shape.height ? this.shape.height : 50);
    this.shapeConfigForm.controls.left.setValue(this.shape.left ? this.shape.left : 100);
    this.shapeConfigForm.controls.top.setValue(this.shape.top ? this.shape.top : 100);
    this.shapeConfigForm.controls.fill.setValue(this.shape.fill ? this.shape.fill as string : 'blue');
    this.shapeConfigForm.controls.radius.setValue(this.shape.radius ? this.shape.radius : 25);
  }

  addEventHandlers(shape: FabricShape): void{
    shape.on('scaling', this.handleObjectScaling.bind(this));
    shape.on('moving', this.handleObjectMoving.bind(this));
  }

  onTypeChange(event: MatSelectChange): void{
    console.log(event.value)
    const shape = this.shapeService.changeShapeType(event.value, this.shape);
    if(shape){
      this.addEventHandlers(shape);
      this.canvas.remove(this.shape);
      this.shape = shape;
      this.canvas.add(this.shape);
      this.canvas.renderAll();
    }
  }

  onRadiusChange(value: number): void{
    if(value <= this.constants.MAX_SHAPE_SIZE / 2 && value >= this.constants.MIN_SHAPE_SIZE / 2){
      this.shape.set('width', value * 2);
      this.shape.set('height', value * 2);
      this.shape.set('radius', value);
      this.canvas.renderAll();
    }
  }

  handleObjectScaling(): void{
    if(this.shape.getScaledWidth() > this.constants.MAX_SHAPE_SIZE){
      const newWidth = this.shape.scaleX ? this.constants.MAX_SHAPE_SIZE / this.shape.scaleX : this.constants.MAX_SHAPE_SIZE;
      this.shape.set('width', newWidth);
    }else if(this.shape.getScaledWidth() < this.constants.MIN_SHAPE_SIZE){
      this.shape.scaleToWidth(this.constants.MIN_SHAPE_SIZE);
      const newWidth = this.shape.scaleX ? this.constants.MIN_SHAPE_SIZE / this.shape.scaleX : this.constants.MIN_SHAPE_SIZE;
      this.shape.set('width', newWidth);
    }

    if(this.shape.getScaledHeight() > this.constants.MAX_SHAPE_SIZE){
      const newHeight = this.shape.scaleY ? this.constants.MAX_SHAPE_SIZE / this.shape.scaleY : this.constants.MAX_SHAPE_SIZE;
      this.shape.set('height', newHeight);
    }else if(this.shape.getScaledHeight() < this.constants.MIN_SHAPE_SIZE){
      const newHeight = this.shape.scaleY ? this.constants.MIN_SHAPE_SIZE / this.shape.scaleY : this.constants.MIN_SHAPE_SIZE;
      this.shape.set('height', newHeight);
    }
    this.shapeConfigForm.controls.width.setValue(parseFloat(this.shape.getScaledWidth().toFixed(2)));
    this.shapeConfigForm.controls.height.setValue(parseFloat(this.shape.getScaledHeight().toFixed(2)));
    this.shapeConfigForm.controls.radius.setValue(parseFloat((this.shape.getScaledWidth() / 2.0).toFixed(2)));
    this.handleObjectMoving();
  }

  handleObjectMoving(): void{
    if(this.shape.left){
      if(this.shape.left > this.canvas.getWidth() - this.shape.getScaledWidth() ){
        this.shape.set('left', this.canvas.getWidth() - this.shape.getScaledWidth());
      }else if(this.shape.left < 0){
        this.shape.set('left', 0);
      }
      this.shapeConfigForm.controls.left.setValue(parseFloat(this.shape.left.toFixed(2)));
    }

    if(this.shape.top){
      if(this.shape.top > this.canvas.getHeight() - this.shape.getScaledHeight()){
        this.shape.set('top', this.canvas.getHeight() - this.shape.getScaledHeight());
      }else if(this.shape.top < 0){
        this.shape.set('top', 0);
      }
      this.shapeConfigForm.controls.top.setValue(parseFloat(this.shape.top.toFixed(2)));
    }
  }

  setObjectAttribute(attribute: keyof FabricShape, value: string) :void {
    if(attribute === 'fill'){
      this.shape.set(attribute, value);
    }else{
      const {minLimit, maxLimit} = this.getLimits(attribute);
      if(minLimit != undefined && maxLimit != undefined && parseFloat(value) <= maxLimit && parseFloat(value) >= minLimit){
        if(attribute === 'width'){
          const newWidth = this.shape.scaleX ? parseFloat(value) / this.shape.scaleX : parseFloat(value);
          this.shape.set('width', newWidth);
          this.handleObjectMoving();
        }else if(attribute === 'height'){
          const newHeight = this.shape.scaleY ? parseFloat(value) / this.shape.scaleY : parseFloat(value);
          this.shape.set('height', newHeight);
          this.handleObjectMoving();
        }else{
        this.shape.set(attribute, parseFloat(value));
        }
        //this.shape.selectable = true;
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
      console.log(this.shape.flashing);
    }
  }
}