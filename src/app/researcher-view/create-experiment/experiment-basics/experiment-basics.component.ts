import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import { ExperimentCreationConstants } from '../experiment-creation.constants';
import { fabric } from 'fabric';

@Component({
  selector: 'app-experiment-basics',
  templateUrl: './experiment-basics.component.html',
  styleUrls: ['./experiment-basics.component.scss', '../create-experiment.component.scss']
})

export class ExperimentBasicsComponent implements AfterViewInit{
  @Input() experiment: Experiment | undefined
  @Output() experimentChange = new EventEmitter<Experiment>();
  @Output() nextStep = new EventEmitter<void>();

  outlineCanvas: fabric.Canvas; //FIXME: crooked shape and label display
  outlineCanvasData: any = {"objects":[{"type":"rect", "originX":"left","originY":"top","left":10,"top":10,"width":50,"height":50},{"type":"circle", "originX":"center","originY":"center","left":100,"top":100,"radius":25}]};
  coloredCanvas: fabric.Canvas;
  coloredCanvasData: any = {"objects":[{"type":"rect", "originX":"left","originY":"top","left":10,"top":10,"width":50,"height":50,"fill":"blue"},{"type":"circle", "originX":"center","originY":"center","left":100,"top":100,"fill":"blue","radius":25}], "background"  :"red"};

  experimentBasicsForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    researcherDescription: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    maxParticipantNum: new FormControl<number>(20, [Validators.required, Validators.min(1), Validators.max(this.constants.MAX_PARTICIPANT_NUM)]),
    controlGroupChance: new FormControl<number>(20, [Validators.required, Validators.min(0), Validators.max(100)]),
    cursorPathImageNeeded: new FormControl<boolean>(false),
    cursorImageMode: new FormControl<string>('Colors included'),
    positionArrayNeeded: new FormControl<boolean>(false),
    positionTrackingFrequency: new FormControl<number>(500, [Validators.min(100),Validators.max(1000)])
  });

  constructor(private experimentService: ExperimentService,
              private constants: ExperimentCreationConstants,
              private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.createCanvases();

    if(this.experiment){
      this.initializeForm();
      this.changeDetector.detectChanges();
    }
  }

  initializeForm(): void{
    if(this.experiment){
      this.experimentBasicsForm.controls.name.setValue(this.experiment?.name);
      this.experimentBasicsForm.controls.researcherDescription.setValue(this.experiment?.researcherDescription);
      this.experimentBasicsForm.controls.maxParticipantNum.setValue(this.experiment?.maxParticipantNum);
      this.experimentBasicsForm.controls.controlGroupChance.setValue(this.experiment?.controlGroupChance);
      this.experimentBasicsForm.controls.positionArrayNeeded.setValue(this.experiment?.positionTrackingFrequency !== undefined);
      this.experimentBasicsForm.controls.positionTrackingFrequency.setValue(this.experiment?.positionTrackingFrequency ?? 500);
      this.experimentBasicsForm.controls.cursorPathImageNeeded.setValue(this.experiment?.cursorImageMode !== undefined);
      this.experimentBasicsForm.controls.cursorImageMode.setValue(this.experiment?.cursorImageMode ?? 'Colors included');
    }
  }

  createCanvases(): void{
    this.outlineCanvas = new fabric.Canvas('outlineCanvas');
    this.outlineCanvas.selection = false;
    this.coloredCanvas = new fabric.Canvas('coloredCanvas');
    this.coloredCanvas.selection = false;

    this.outlineCanvas.loadFromJSON(this.outlineCanvasData, this.outlineCanvas.renderAll.bind(this.outlineCanvas), (o: any, object: any) => {
      object.set('selectable', false);
    });
    this.coloredCanvas.loadFromJSON(this.coloredCanvasData, this.coloredCanvas.renderAll.bind(this.coloredCanvas), (o: any, object: any) => {
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
          console.log("created experiment")
          console.log(experiment)
          this.handleExperimentChange(experiment);
        },
        error: (error) => {
          console.log(error); //TODO: display error message
        }
      });
  }

  updateExperiment(): void{
    console.log(this.experimentBasicsForm.value)
    this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: this.experimentBasicsForm.value}).subscribe({
      next: (experiment) => {
        console.log("updated experiment")
        console.log(experiment)
        this.handleExperimentChange(experiment);
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
  }

  handleExperimentChange(experiment: Experiment): void {
    this.experiment = experiment;
    this.experimentBasicsForm.markAsPristine();
    this.experimentChange.emit(this.experiment);
    this.nextStep.emit();
  }
}
