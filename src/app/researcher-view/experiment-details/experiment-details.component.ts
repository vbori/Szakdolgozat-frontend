import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Experiment } from 'src/app/common/models/experiment.model';
import { ExperimentService } from 'src/app/common/services/experiment.service';
import * as p5 from 'p5';


@Component({
  selector: 'app-experiment-details',
  templateUrl: './experiment-details.component.html',
  styleUrls: ['./experiment-details.component.scss']
})
export class ExperimentDetailsComponent implements OnInit {
  experiment: Experiment;
  private p5Instance: any;
  @ViewChild('testDiv', {static: true}) testDiv: ElementRef;

  constructor(private readonly route: ActivatedRoute,
              private readonly experimentService: ExperimentService,
              private renderer: Renderer2 ) {}

  ngOnInit(): void {
    this.experimentService.getExperimentById(this.route.snapshot.params['id']).subscribe(data => this.experiment = data);
  }

  ngAfterViewInit() {
    const element = document.getElementById('mySketch') as HTMLElement;
    const button = this.renderer.createElement('button');
    const buttonText = this.renderer.createText('Click me!');
    this.renderer.appendChild(button, buttonText);
    this.renderer.setStyle(button, 'position', 'absolute');
    this.renderer.setStyle(button, 'top', '50px');
    this.renderer.setStyle(button, 'left', '100px');
    console.log('Ez meg mukodik')
    this.renderer.appendChild(this.testDiv.nativeElement, button);
    console.log('Sikerult fasz')
    this.p5Instance = new p5(this.sketch, element);
  }

  private sketch(p: any) {
    p.setup = function() {
      p.createCanvas(400, 400);
    };

    let button = p.createButton('button1');
    button.size(100, 50);
    button.mouseOver(() => {
      console.log('mouse over button');
    });
    button.style('background-color', 'yellow'); // set button background color
    button.style('border-color', 'blue'); // set button border color
    button.style('border-width', '5px'); // set button border width

    let button2 = p.createButton('button2');
    button2.mouseClicked(() => {
      button.size(200,100)
    });

    p.draw = function() {
      p.background(255, 255, 255);
      p.stroke(0, 0, 255);
      p.strokeWeight(30);
      p.fill(255, 255, 0);

      let rect = p.rect(50, 50, 100, 100)

      //p.rect(50, 50, 100, 100);
    };
  }
}
