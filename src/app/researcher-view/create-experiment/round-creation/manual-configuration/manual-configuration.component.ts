import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExperimentCreationConstants } from '../../experiment-creation.constants';
import { FabricShape, NewRound, NewRoundClass, NewShape } from 'src/app/common/models/newRound.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { Router } from '@angular/router';
import { Experiment } from 'src/app/common/models/experiment.model';

@Component({
  selector: 'app-manual-configuration',
  templateUrl: './manual-configuration.component.html',
  styleUrls: ['./manual-configuration.component.scss']
})
export class ManualConfigurationComponent implements OnInit{

  canvasForm = new FormGroup({
    canvasHeight: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_HEIGHT), Validators.max(this.constants.MAX_CANVAS_HEIGHT)]}),
    canvasWidth: new FormControl<number>(600, {nonNullable: true, validators: [Validators.required, Validators.min(this.constants.MIN_CANVAS_WIDTH), Validators.max(this.constants.MAX_CANVAS_WIDTH)]}),
  });

  isRoundValid: Boolean[] = [true];
  canvases: fabric.Canvas[] = [];
  rounds: NewRound[] = [new NewRoundClass()];
  @Input() experiment: Experiment | undefined;

  constructor(public constants: ExperimentCreationConstants, private readonly experimentService: ExperimentService, private router: Router) { }

  ngOnInit(): void {
    if(this.experiment?.rounds){
      this.rounds = this.experiment.rounds.map((round) => new NewRoundClass(round));
    }
  }

  addRound() {
    this.isRoundValid.push(true);
    this.rounds.push(new NewRoundClass());
  }

  removeRound(index: number) {
    this.isRoundValid.splice(index, 1);
    this.canvases.splice(index, 1);
    this.rounds.splice(index, 1);
  }

  isSubmitDisabled(): boolean {
    return this.isRoundValid.includes(false);
  }

  onValidityChange(index: number, valid: boolean) {
    this.isRoundValid[index] = valid;
  }

  onCanvasCreated(canvas: fabric.Canvas){
    this.canvases.push(canvas);
  }

  createExperiment(){
    console.log(this.rounds);
    for (let i = 0; i < this.rounds.length; i++){
      this.syncRoundAndCanvas(i);
    }
    if(this.experiment)
    this.experimentService.updateExperiment({experimentId: this.experiment._id ,updatedExperiment: {rounds: this.rounds}}).subscribe({
      next: (experiment) => {
        this.router.navigate(['/research/experiment/details/', this.experiment?._id]);
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
  }

  syncRoundAndCanvas(index: number): void {
    let round = this.rounds[index];
    let canvas = this.canvases[index];
    round.canvasWidth = canvas.getWidth();
    round.canvasHeight = canvas.getHeight();
    round.roundIdx = index + 1;
    if(round.shapeDistractionDuration){
      round.objects = canvas.getObjects().map((shape: FabricShape) => this.convertToNewShape(shape));
    }else{
      round.objects = canvas.getObjects().filter((shape: FabricShape) => !shape.distraction).map((shape: FabricShape) => this.convertToNewShape(shape));
    }
  }

  convertToNewShape(shape: FabricShape): NewShape {
    const newShape: NewShape = {
      target: shape.target || false,
      distraction: shape.distraction || false,
      flashing: shape.flashing || undefined,
      baseColor: shape.fill as string || undefined,
      type: shape.type ?? 'rect',
      radius: shape.radius || undefined,
      originX: shape.originX ?? 'left',
      originY: shape.originY ?? 'top',
      left: shape.left ?? 0,
      top: shape.top ?? 0,
      width: shape.getScaledWidth() ?? 0,
      height: shape.getScaledHeight() ?? 0,
      fill: shape.fill as string ?? '#000000',
      strokeWidth: 0
    };
    return newShape;
  }
}
