import { Component, Input } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Round } from 'src/app/common/models/round.model';
import { Column } from 'src/app/researcher-view/models/column.model';

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
  columnsToDisplay: Column[] = [{header: 'Index', property: 'roundIdx'}, {header: 'Rest Time', property: 'restTime'}, {header: 'Practice Round', property: 'isPractice'}, {header: 'Use Background Distraction', property: 'useBackgroundDistraction'}, {header: 'Use Shape Distractions', property: 'useShapeDistractions'}];
  headers = this.columnsToDisplay.map(column => column.header);
  columnsToDisplayWithExpand = [...this.headers,'expand'];
  expandedElement: Round | null;

  ngOnInit(): void {
    console.log(this.dataSource);
  }
}
