import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExperimentDetailsComponent', () => {
  let component: ExperimentDetailsComponent;
  let fixture: ComponentFixture<ExperimentDetailsComponent>;
  const experiment = {
    _id: '1',
    name: 'Test Experiment',
    researcherDescription: 'Test Description',
    participantDescription: 'Test Description',
    status: 'Draft',
    participantNum: 0,
    maxParticipantNum: 10,
    controlGroupChance: 20,
    rounds: []
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentDetailsComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatDividerModule,
        MatListModule,
        RouterLink
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params : {id: '1'}}
          }
        },
        ToastrService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Experiment is active', () => {
    beforeEach(() => {
      component.experiment = {
        _id: '1',
        name: 'Test Experiment',
        researcherDescription: 'Test Description',
        participantDescription: 'Test Description',
        status: 'Active',
        participantNum: 4,
        maxParticipantNum: 10,
        controlGroupChance: 0,
        rounds: [{roundIdx: 0, canvasWidth:400, canvasHeight:400, background:"#ffffff", objects: [{type: 'rect', width: 100, height: 100, fill: '#ff0000', left: 0, top: 0, target: true, distraction: false, originX: 'left', originY: 'top', strokeWidth: 0}]}]
      }
      fixture.detectChanges();
    });

    it ('should show "Close experiment" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#close-btn')).toBeTruthy();
    });

    it ('should show "View demo" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#demo-btn')).toBeTruthy();
    });

    it ('should show "Copy invite link" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#copy-btn')).toBeTruthy();
    });

    it ('should not show "Open experiment" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#open-btn')).toBeFalsy();
    });

    it ('should not show "Delete experiment" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#delete-btn')).toBeFalsy();
    });

    it ('should not show "Edit experiment" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#edit-btn')).toBeFalsy();
    });


    it ('should not show "Download results as JSON" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#json-btn')).toBeFalsy();
    });

    it ('should not show "Download results as CSV" button if experiment is active', () => {
      expect(component.experiment.status).toEqual('Active');
      expect(fixture.nativeElement.querySelector('#csv-btn')).toBeFalsy();
    });
  });

  describe('Experiment is draft', () => {
    beforeEach(() => {
      component.experiment = {
        _id: '1',
        name: 'Test Experiment',
        researcherDescription: 'Test Description',
        participantDescription: 'Test Description',
        status: 'Draft',
        participantNum: 0,
        maxParticipantNum: 10,
        controlGroupChance: 0,
        rounds: [{roundIdx: 0, canvasWidth:400, canvasHeight:400, background:"#ffffff", objects: [{type: 'rect', width: 100, height: 100, fill: '#ff0000', left: 0, top: 0, target: true, distraction: false, originX: 'left', originY: 'top', strokeWidth: 0}]}]
      }
      fixture.detectChanges();
    });

    it ('should show "Open experiment" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#open-btn')).toBeTruthy();
    });

    it ('should show "Delete experiment" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#delete-btn')).toBeTruthy();
    });

    it ('should show "Edit experiment" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#edit-btn')).toBeTruthy();
    });

    it ('should not show "Close experiment" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#close-btn')).toBeFalsy();
    });

    it ('should not show "Copy invite link" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#copy-btn')).toBeFalsy();
    });

    it ('should not show "Download results as JSON" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#json-btn')).toBeFalsy();
    });

    it ('should not show "Download results as CSV" button if experiment is draft', () => {
      expect(component.experiment.status).toEqual('Draft');
      expect(fixture.nativeElement.querySelector('#csv-btn')).toBeFalsy();
    });

    describe('Experiment is draft with rounds', () => {
      beforeEach(() => {
        component.experiment = {
          _id: '1',
        name: 'Test Experiment',
        researcherDescription: 'Test Description',
        participantDescription: 'Test Description',
        status: 'Draft',
        participantNum: 0,
        maxParticipantNum: 10,
        controlGroupChance: 0,
        rounds: []
      }
      fixture.detectChanges();
      });

      it ('should not show "View demo" button if experiment is draft and has no rounds', () => {
        expect(component.experiment.status).toEqual('Draft');
        expect(component.experiment.rounds.length).toEqual(0);
        expect(fixture.nativeElement.querySelector('#demo-btn')).toBeFalsy();
      });

      it ('"Open experiment" button should be disabled if experiment is draft and has no rounds', () => {
        expect(component.experiment.status).toEqual('Draft');
        expect(component.experiment.rounds.length).toEqual(0);
        expect(fixture.nativeElement.querySelector('#open-btn').disabled).toBeTruthy();
      });
    });

    describe('Experiment is draft with rounds', () => {
      beforeEach(() => {
        component.experiment = {
          _id: '1',
          name: 'Test Experiment',
          researcherDescription: 'Test Description',
          participantDescription: 'Test Description',
          status: 'Draft',
          participantNum: 0,
          maxParticipantNum: 10,
          controlGroupChance: 0,
          rounds: [{roundIdx: 0, canvasWidth:400, canvasHeight:400, background:"#ffffff", objects: [{type: 'rect', width: 100, height: 100, fill: '#ff0000', left: 0, top: 0, target: true, distraction: false, originX: 'left', originY: 'top', strokeWidth: 0}]}]
        }
        fixture.detectChanges();
      });

      it ('should show "View demo" button if experiment is draft and has rounds', () => {
        expect(component.experiment.status).toEqual('Draft');
        expect(component.experiment.rounds.length).toEqual(1);
        expect(fixture.nativeElement.querySelector('#demo-btn')).toBeTruthy();
      });

      it ('"Open experiment" button should be enabled if experiment is draft and has rounds', () => {
        expect(component.experiment.status).toEqual('Draft');
        expect(component.experiment.rounds.length).toEqual(1);
        expect(fixture.nativeElement.querySelector('#open-btn').disabled).toBeFalsy();
      });

    });
  });

  describe('Experiment is closed', () => {
    beforeEach(() => {
      component.experiment = {
        _id: '1',
        name: 'Test Experiment',
        researcherDescription: 'Test Description',
        participantDescription: 'Test Description',
        status: 'Closed',
        participantNum: 0,
        maxParticipantNum: 10,
        controlGroupChance: 0,
        rounds: [{roundIdx: 0, canvasWidth:400, canvasHeight:400, background:"#ffffff", objects: [{type: 'rect', width: 100, height: 100, fill: '#ff0000', left: 0, top: 0, target: true, distraction: false, originX: 'left', originY: 'top', strokeWidth: 0}]}]
      }
      fixture.detectChanges();
    });

    it ('should not show "Open experiment" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#open-btn')).toBeFalsy();
    });

    it ('should show "Delete experiment" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#delete-btn')).toBeTruthy();
    });

    it ('should not show "Edit experiment" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#edit-btn')).toBeFalsy();
    });

    it ('should not show "Close experiment" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#close-btn')).toBeFalsy();
    });

    it ('should not show "Copy invite link" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#copy-btn')).toBeFalsy();
    });

    it ('should show "Download results as JSON" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#json-btn')).toBeTruthy();
    });

    it ('should show "Download results as CSV" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#csv-btn')).toBeTruthy();
    });

    it ('should show "View demo" button if experiment is closed', () => {
      expect(component.experiment.status).toEqual('Closed');
      expect(fixture.nativeElement.querySelector('#demo-btn')).toBeTruthy();
    });
  });
});
