import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(private experimentService: ExperimentService, private constants: ExperimentCreationConstants) { }

  ngAfterViewInit(): void {
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

  onSubmit(){
    if(!this.experiment){
      this.createExperiment();
    }else if(!this.experimentBasicsForm.pristine){
      this.updateExperiment();
    }else{
      this.nextStep.emit();
    }
  }

  createExperiment(){
    let {name, researcherDescription, maxParticipantNum, controlGroupChance, cursorPathImageNeeded} = this.experimentBasicsForm.value;
    let positionTrackingFrequency = null;
    let cursorImageMode = null;

    if(this.experimentBasicsForm.controls.positionArrayNeeded)
      positionTrackingFrequency = this.experimentBasicsForm.controls.positionTrackingFrequency.value;
    if(this.experimentBasicsForm.controls.cursorPathImageNeeded)
      cursorImageMode = this.experimentBasicsForm.controls.cursorImageMode.value;

    if(name && researcherDescription && maxParticipantNum && controlGroupChance)
      this.experimentService.createExperiment(name, researcherDescription,
        maxParticipantNum, controlGroupChance, cursorImageMode, positionTrackingFrequency).subscribe({
        next: (experiment) => {
          console.log("created experiment")
          console.log(experiment)
          this.experiment = experiment;
          this.experimentBasicsForm.markAsPristine();
          this.experimentChange.emit(this.experiment);
          this.nextStep.emit();
        },
        error: (error) => {
          console.log(error); //TODO: display error message
        }
      });
  }

  updateExperiment(){
    console.log(this.experimentBasicsForm.value)
    this.experimentService.updateExperiment({experimentId: this.experiment?._id, updatedExperiment: this.experimentBasicsForm.value}).subscribe({
      next: (experiment) => {
        console.log("updated experiment")
        console.log(experiment)
        this.experiment = experiment;
        this.experimentBasicsForm.markAsPristine();
        this.experimentChange.emit(this.experiment);
        this.nextStep.emit();
      },
      error: (error) => {
        console.log(error); //TODO: display error message
      }
    });
  }
}
