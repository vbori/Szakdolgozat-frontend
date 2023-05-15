import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentCreationConstants } from '../experiment-creation.constants';
import { fabric } from 'fabric';
import { IRound } from 'src/app/common/models/round.model';
import { ToastrService } from 'ngx-toastr';
import { FabricShape } from 'src/app/common/models/shape.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-experiment-basics',
  templateUrl: './experiment-basics.component.html',
  styleUrls: ['./experiment-basics.component.scss', '../create-experiment.component.scss']
})

export class ExperimentBasicsComponent implements AfterViewInit, OnDestroy{
  @Input() experiment: Experiment | undefined = undefined;
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  subscriptions: Subscription[] = [];

  outlineCanvas: fabric.Canvas;
  outlineCanvasData: IRound = {"objects":[{"type":"rect", "originX":"left","originY":"top","left":10,"top":10,"width":50,"height":50, "target": false, "distraction": false, "fill": "#fff", "strokeWidth": 1},{"type":"circle", "originX":"left","originY":"top","left":100,"top":100,"radius":25, "target": false, "distraction": false, "fill": "#fff", "strokeWidth": 1, "width":50,"height":50}], canvasHeight:200, canvasWidth:200, "background"  :"#fff"};
  coloredCanvas: fabric.Canvas;
  coloredCanvasData: IRound = {"objects":[{"type":"rect", "originX":"left","originY":"top","left":10,"top":10,"width":50,"height":50,"fill":"blue", "target": false, "distraction": false, "strokeWidth": 1},{"type":"circle", "originX":"left","originY":"top","left":100,"top":100,"fill":"blue","radius":25, "target": false, "distraction": false, "strokeWidth": 1, "width":50,"height":50}], canvasHeight:200, canvasWidth:200, "background"  :"red"};

  experimentBasicsForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    researcherDescription: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    maxParticipantNum: new FormControl<number>(20, [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_PARTICIPANT_NUM),Validators.pattern("^[0-9]*$")]),
    controlGroupChance: new FormControl<number>(20, [Validators.required, Validators.min(0), Validators.max(100),Validators.pattern("^[0-9]*$")]),
    cursorPathImageNeeded: new FormControl<boolean>(false),
    cursorImageMode: new FormControl<string>('Outlines only'),
    positionArrayNeeded: new FormControl<boolean>(false),
    positionTrackingFrequency: new FormControl<number>(500, [Validators.min(this.constants.MIN_TRACKING_FREQUENCY),Validators.max(this.constants.MAX_TRACKING_FREQUENCY),Validators.pattern("^[0-9]*$")])
  });

  constructor(private experimentService: ExperimentService,
              public constants: ExperimentCreationConstants,
              private changeDetector: ChangeDetectorRef,
              private toastr: ToastrService) { }

  ngAfterViewInit(): void {
    this.createCanvases();

    if(this.experiment){
      this.initializeForm();
    }

    let subscription = this.experimentBasicsForm.get('positionArrayNeeded')?.valueChanges.subscribe(value => {
      if(value){
        this.experimentBasicsForm.get('positionTrackingFrequency')?.enable();
      }else{
        this.experimentBasicsForm.get('positionTrackingFrequency')?.disable();
      }

      this.changeDetector.detectChanges();
    });

    if(subscription){
      this.subscriptions.push(subscription);
    }

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.outlineCanvas.dispose();
    this.coloredCanvas.dispose();
  }

  initializeForm(): void{
    if(this.experiment){
      this.experimentBasicsForm.controls.name.setValue(this.experiment?.name);
      this.experimentBasicsForm.controls.researcherDescription.setValue(this.experiment?.researcherDescription);
      this.experimentBasicsForm.controls.maxParticipantNum.setValue(this.experiment?.maxParticipantNum);
      this.experimentBasicsForm.controls.controlGroupChance.setValue(this.experiment?.controlGroupChance);
      this.experimentBasicsForm.controls.positionArrayNeeded.setValue(!!this.experiment?.positionTrackingFrequency);
      this.experimentBasicsForm.controls.positionTrackingFrequency.setValue(this.experiment?.positionTrackingFrequency ?? 500);
      this.experimentBasicsForm.controls.cursorPathImageNeeded.setValue(!!this.experiment?.cursorImageMode);
      this.experimentBasicsForm.controls.cursorImageMode.setValue(this.experiment?.cursorImageMode ?? 'Outlines only');
    }
  }

  createCanvases(): void{
    this.outlineCanvas = new fabric.Canvas('outlineCanvas');
    this.outlineCanvas.selection = false;
    this.outlineCanvas.hoverCursor = 'default';
    this.outlineCanvas.setHeight(this.outlineCanvasData.canvasHeight);
    this.outlineCanvas.setWidth(this.outlineCanvasData.canvasWidth);
    this.coloredCanvas = new fabric.Canvas('coloredCanvas');
    this.coloredCanvas.selection = false;
    this.coloredCanvas.hoverCursor = 'default';
    this.coloredCanvas.setHeight(this.coloredCanvasData.canvasHeight);
    this.coloredCanvas.setWidth(this.coloredCanvasData.canvasWidth);

    this.outlineCanvas.loadFromJSON(this.outlineCanvasData, this.outlineCanvas.renderAll.bind(this.outlineCanvas), (o: any, object: FabricShape) => {
      object.set('selectable', false);
      object.set('stroke', '#000000');
    });
    this.coloredCanvas.loadFromJSON(this.coloredCanvasData, this.coloredCanvas.renderAll.bind(this.coloredCanvas), (o: any, object: FabricShape) => {
      object.set('selectable', false);
    });
  }

  onSubmit(): void{
    if(!this.experiment){
      this.createExperiment();
    }else if(!this.experimentBasicsForm.pristine){
      this.updateExperiment();
    }else{
      this.nextStep.emit();
    }
  }

  createExperiment(): void{
    let {name, researcherDescription, maxParticipantNum, controlGroupChance} = this.experimentBasicsForm.value;
    let positionTrackingFrequency: number | undefined = undefined;
    let cursorImageMode = undefined;

    if(this.experimentBasicsForm.value.positionArrayNeeded)
      positionTrackingFrequency = this.experimentBasicsForm.controls.positionTrackingFrequency.value ?? undefined;
    if(this.experimentBasicsForm.value.cursorPathImageNeeded)
      cursorImageMode = this.experimentBasicsForm.controls.cursorImageMode.value ?? undefined;

    if(name && researcherDescription && maxParticipantNum && controlGroupChance)
      this.experimentService.createExperiment(name, researcherDescription,
        maxParticipantNum, controlGroupChance, cursorImageMode, positionTrackingFrequency).subscribe({
        next: (experiment) => {
          this.handleExperimentChange(experiment);
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
  }

  updateExperiment(): void{
    let {name, researcherDescription, maxParticipantNum, controlGroupChance} = this.experimentBasicsForm.value;
    let positionTrackingFrequency: number | null = null;
    let cursorImageMode: string | null = null;

    if(this.experimentBasicsForm.value.positionArrayNeeded)
      positionTrackingFrequency = this.experimentBasicsForm.controls.positionTrackingFrequency.value ?? null;
    if(this.experimentBasicsForm.value.cursorPathImageNeeded)
      cursorImageMode = this.experimentBasicsForm.controls.cursorImageMode.value ?? null;

    if(name && researcherDescription && maxParticipantNum && controlGroupChance){
      const updatedExperiment = { name, researcherDescription, maxParticipantNum, controlGroupChance, cursorImageMode, positionTrackingFrequency}
      this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: updatedExperiment}).subscribe({
        next: (experiment) => {
          this.handleExperimentChange(experiment);
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
        }
      });
    }
  }

  handleExperimentChange(experiment: Experiment): void {
    this.experiment = experiment;
    this.toastr.success('Settings saved', 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
    this.experimentBasicsForm.markAsPristine();
    this.experimentChange.emit(this.experiment);
    this.nextStep.emit();
  }
}
