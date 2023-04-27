import { Component, Input } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Column } from 'src/app/researcher-view/models/column.model';
import { Round } from 'src/app/common/models/round.model';

@Component({
  selector: 'app-rounds-table',
  templateUrl: './rounds-table.component.html',
  styleUrls: ['./rounds-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class RoundsTableComponent {
  @Input() dataSource: Round[];
  columnsToDisplay: Column[] = [{header: 'Index', property: 'roundIdx'}, {header: 'Using Background Distraction', property: 'backgroundDistraction'}, {header: 'Using Shape Distraction', property: 'shapeDistractionDuration'}];
  headers = this.columnsToDisplay.map(column => column.header);
  columnsToDisplayWithExpand = [...this.headers,'expand'];
  expandedElement: Round | null;

  ngOnInit(): void {
    console.log(this.dataSource);
  }
}

//TODO: add canvases and details to the table