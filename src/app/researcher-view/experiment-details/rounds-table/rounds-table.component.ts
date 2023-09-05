import { Component, Input } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Column } from 'src/app/researcher-view/models/column.model';
import { IRound } from 'src/app/common/models/round.model';

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
  @Input() dataSource: IRound[] = [];
  columnsToDisplay: Column[] = [{header: 'Index', property: 'roundIdx'}, {header: 'Using Background Distraction', property: 'backgroundDistraction'}, {header: 'Using Shape Distraction', property: 'shapeDistractionDuration'}, {header: 'Break Time', property: 'breakTime'}];
  headers = this.columnsToDisplay.map(column => column.header);
  columnsToDisplayWithExpand = [...this.headers,'expand'];
  expandedElement: IRound | undefined;
}
