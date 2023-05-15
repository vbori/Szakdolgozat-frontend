import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExperimentCreationConstants } from '../../experiment-creation.constants';
import { IRound, Round } from 'src/app/common/models/round.model';

import { ExperimentService } from 'src/app/common/services/experiment.service';
import { Router } from '@angular/router';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ToastrService } from 'ngx-toastr';
import { FabricShape, IShape, ShapeType } from 'src/app/common/models/shape.model';

@Component({
  selector: 'app-manual-configuration',
  templateUrl: './manual-configuration.component.html',
  styleUrls: ['./manual-configuration.component.scss']
})
export class ManualConfigurationComponent implements OnInit, OnDestroy{

  canvasForm = new FormGroup({
    canvasHeight: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_HEIGHT), Validators.max(this.constants.MAX_CANVAS_HEIGHT)]}),
    canvasWidth: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_WIDTH), Validators.max(this.constants.MAX_CANVAS_WIDTH)]}),
  });
  hasError: boolean = false;
  isRoundValid: Boolean[] = [];
  canvases: fabric.Canvas[] = [];
  rounds: IRound[] = [];
  @Input() experiment: Experiment | undefined;

  constructor(public constants: ExperimentCreationConstants,
              private readonly experimentService: ExperimentService,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    if(this.experiment?.rounds && this.experiment.rounds.length > 0){
      this.toastr.info('Loading experiment configuration', 'Loading', { progressBar: true, positionClass: 'toast-bottom-right' });
      setTimeout(() => {
        if(this.experiment)
        this.rounds = this.experiment.rounds.map((round) => new Round(round));
        this.isRoundValid = this.rounds.map(() => true);
        this.canvasForm.controls.canvasHeight.setValue(this.rounds[0].canvasHeight);
        this.canvasForm.controls.canvasWidth.setValue(this.rounds[0].canvasWidth);
        this.changeDetector.detectChanges();
      }, 200);
    }else{
      this.rounds  = [new Round()];
      this.isRoundValid = [true];
    }
  }

  ngOnDestroy(): void {
    this.canvases.forEach((canvas) => canvas.dispose());
  }

  addRound(): void {
    this.isRoundValid.push(true);
    this.syncRoundAndCanvas(this.rounds.length-1);
    this.rounds.push(new Round(this.rounds[this.rounds.length-1]));
  }

  removeRound(index: number): void {
    this.isRoundValid.splice(index, 1);
    this.isSubmitDisabled();
    this.canvases.splice(index, 1);
    this.rounds.splice(index, 1);
  }

  isSubmitDisabled(): void {
    this.hasError =  this.isRoundValid.includes(false) || this.canvasForm.invalid;
  }

  onValidityChange(index: number, valid: boolean): void {
    this.isRoundValid[index] = valid;
    this.isSubmitDisabled();
  }

  onCanvasCreated(canvas: fabric.Canvas): void{
    this.canvases.push(canvas);
  }

  createExperiment(): void{
    for (let i = 0; i < this.rounds.length; i++){
      this.syncRoundAndCanvas(i);
    }
    if(this.experiment){
      this.experimentService.updateExperiment({experimentId: this.experiment._id ,updatedExperiment: {rounds: this.rounds}}).subscribe({
        next: () => {
          this.router.navigate(['/research/experiment/details/', this.experiment?._id]);
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }
  }

  syncRoundAndCanvas(index: number): void {
    let round = this.rounds[index];
    let canvas = this.canvases[index];
    round.canvasWidth = canvas.getWidth();
    round.canvasHeight = canvas.getHeight();
    round.background = canvas.backgroundColor as string;
    round.roundIdx = index + 1;
    if(round.shapeDistractionDuration){
      round.objects = canvas.getObjects().map((shape: FabricShape) => this.convertToNewShape(shape));
    }else{
      round.objects = canvas.getObjects().filter((shape: FabricShape) => !shape.distraction).map((shape: FabricShape) => this.convertToNewShape(shape));
    }
  }

  convertToNewShape(shape: FabricShape): IShape {
    const newShape: IShape = {
      target: shape.target || false,
      distraction: shape.distraction || false,
      flashing: shape.flashing || undefined,
      baseColor: shape.fill as string || undefined,
      type: shape.type  as ShapeType ?? 'rect',
      radius: shape.radius ? Math.round(shape.getScaledWidth())/2 : undefined,
      originX: shape.originX ?? 'left',
      originY: shape.originY ?? 'top',
      left: shape.left ? Math.floor(shape.left) : 0,
      top: shape.top ? Math.floor(shape.top) : 0,
      width: Math.round(shape.getScaledWidth()) ?? 0,
      height: Math.round(shape.getScaledHeight()) ?? 0,
      fill: shape.fill as string ?? '#000000',
      strokeWidth: 0
    };
    return newShape;
  }
}
