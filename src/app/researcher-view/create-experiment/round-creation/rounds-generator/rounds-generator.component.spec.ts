import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RoundsGeneratorComponent } from './rounds-generator.component';
import { ExperimentConfiguration } from 'src/app/researcher-view/models/config.model';

describe('RoundsGeneratorComponent', () => {
  let component: RoundsGeneratorComponent;
  let fixture: ComponentFixture<RoundsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsGeneratorComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#generateRounds', () => {

    it('should generate setNum * roundNum rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(2);
      component.roundGeneratorForm.controls['setNum'].setValue(3);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      expect(rounds.length).toEqual(6);
    });

    it('target shape should have the shape type selected in the form', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['circle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let targetShape = rounds[0].objects.find(shape => shape.target);
      expect(targetShape?.type).toEqual('circle');
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['rect']);
      rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      targetShape = rounds[0].objects.find(shape => shape.target);
      expect(targetShape?.type).toEqual('rect');
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['square']);
      rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      targetShape = rounds[0].objects.find(shape => shape.target);
      expect(targetShape?.type).toEqual('rect');
      expect(targetShape?.width).toEqual(targetShape?.height);
    });

    it('base shape should have the shape type selected in the form', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['baseShapeTypes'].setValue(['circle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let baseShape = rounds[0].objects.find(shape => !shape.target && !shape.distraction);
      expect(baseShape?.type).toEqual('circle');
      component.roundGeneratorForm.controls['baseShapeTypes'].setValue(['rect']);
      rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      baseShape = rounds[0].objects.find(shape => !shape.target && !shape.distraction);
      expect(baseShape?.type).toEqual('rect');
      component.roundGeneratorForm.controls['baseShapeTypes'].setValue(['square']);
      rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      baseShape = rounds[0].objects.find(shape => !shape.target && !shape.distraction);
      expect(baseShape?.type).toEqual('rect');
      expect(baseShape?.width).toEqual(baseShape?.height);
    });

    it('base shape should be the same in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(2);
      component.roundGeneratorForm.controls['baseShapeTypes'].setValue(['circle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let baseShape = rounds[0].objects.find(shape => !shape.target && !shape.distraction);
      let baseShape2 = rounds[1].objects.find(shape => !shape.target && !shape.distraction);
      expect(baseShape?.type).toEqual(baseShape2?.type);
    });

    it('target shape should be the same in all rounds of a set', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(2);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['circle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let targetShape = rounds[0].objects.find(shape => shape.target);
      let targetShape2 = rounds[1].objects.find(shape => shape.target);
      expect(targetShape?.type).toEqual(targetShape2?.type);
      expect(targetShape?.width).toEqual(targetShape2?.width);
      expect(targetShape?.height).toEqual(targetShape2?.height);
      expect(targetShape?.fill).toEqual(targetShape2?.fill);
      expect(targetShape?.top).toEqual(targetShape2?.top);
      expect(targetShape?.left).toEqual(targetShape2?.left);
    });

    it('shape sizes should be between min and max size', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['minWidth'].setValue(10);
      component.roundGeneratorForm.controls['maxWidth'].setValue(20);
      component.roundGeneratorForm.controls['minHeight'].setValue(10);
      component.roundGeneratorForm.controls['maxHeight'].setValue(20);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let shapes = rounds[0].objects;
      shapes.forEach(shape => {
        expect(shape.width).toBeGreaterThanOrEqual(10);
        expect(shape.width).toBeLessThanOrEqual(20);
        expect(shape.height).toBeGreaterThanOrEqual(10);
        expect(shape.height).toBeLessThanOrEqual(20);
      });
    });

    it('shape\'s color should be the set color', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['baseShapeColor'].setValue('#ff0000');
      component.roundGeneratorForm.controls['targetShapeColor'].setValue('#00ff00');
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let baseShape = rounds[0].objects.find(shape => !shape.target && !shape.distraction);
      let targetShape = rounds[0].objects.find(shape => shape.target);
      expect(baseShape?.fill).toEqual('#ff0000');
      expect(targetShape?.fill).toEqual('#00ff00');
    });

    it('background color should be the set color in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(2);
      component.roundGeneratorForm.controls['backgroundColor'].setValue('#ff0000');
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      expect(rounds[0].background).toEqual('#ff0000');
      expect(rounds[1].background).toEqual('#ff0000');
    });

    it('canvas size should be the set size in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(2);
      component.roundGeneratorForm.controls['canvasWidth'].setValue(400);
      component.roundGeneratorForm.controls['canvasHeight'].setValue(500);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      expect(rounds[0].canvasWidth).toEqual(400);
      expect(rounds[0].canvasHeight).toEqual(500);
      expect(rounds[1].canvasWidth).toEqual(400);
      expect(rounds[1].canvasHeight).toEqual(500);
    });

    it('canvas size should be the set size in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(2);
      component.roundGeneratorForm.controls['canvasWidth'].setValue(400);
      component.roundGeneratorForm.controls['canvasHeight'].setValue(500);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      expect(rounds[0].canvasWidth).toEqual(400);
      expect(rounds[0].canvasHeight).toEqual(500);
      expect(rounds[1].canvasWidth).toEqual(400);
      expect(rounds[1].canvasHeight).toEqual(500);
    });

    it('if target shape position change is disabled, target shapes should be in the same position in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(3);
      component.roundGeneratorForm.controls['changePosition'].setValue(false);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let targetShape = rounds[0].objects.find(shape => shape.target);
      let targetShape2 = rounds[1].objects.find(shape => shape.target);
      let targetShape3 = rounds[2].objects.find(shape => shape.target);
      expect(targetShape?.top).toEqual(targetShape2?.top);
      expect(targetShape?.left).toEqual(targetShape2?.left);
      expect(targetShape?.top).toEqual(targetShape3?.top);
      expect(targetShape?.left).toEqual(targetShape3?.left);
    });

    it('if target shape size change is disabled, target shapes should have the same size in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(3);
      component.roundGeneratorForm.controls['changeShapeSize'].setValue(false);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let targetShape = rounds[0].objects.find(shape => shape.target);
      let targetShape2 = rounds[1].objects.find(shape => shape.target);
      let targetShape3 = rounds[2].objects.find(shape => shape.target);
      expect(targetShape?.width).toEqual(targetShape2?.width);
      expect(targetShape?.height).toEqual(targetShape2?.height);
      expect(targetShape?.width).toEqual(targetShape3?.width);
      expect(targetShape?.height).toEqual(targetShape3?.height);
    });

    it('if both target shape size change and position change are disabled, and only one target shape type is given, target shapes should be the same in all rounds', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(1);
      component.roundGeneratorForm.controls['setNum'].setValue(3);
      component.roundGeneratorForm.controls['changeShapeSize'].setValue(false);
      component.roundGeneratorForm.controls['changePosition'].setValue(false);
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['circle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      let targetShape = rounds[0].objects.find(shape => shape.target);
      let targetShape2 = rounds[1].objects.find(shape => shape.target);
      let targetShape3 = rounds[2].objects.find(shape => shape.target);
      expect(targetShape?.width).toEqual(targetShape2?.width);
      expect(targetShape?.height).toEqual(targetShape2?.height);
      expect(targetShape?.width).toEqual(targetShape3?.width);
      expect(targetShape?.height).toEqual(targetShape3?.height);
      expect(targetShape?.top).toEqual(targetShape2?.top);
      expect(targetShape?.left).toEqual(targetShape2?.left);
      expect(targetShape?.top).toEqual(targetShape3?.top);
      expect(targetShape?.left).toEqual(targetShape3?.left);
      expect(targetShape?.fill).toEqual(targetShape2?.fill);
      expect(targetShape?.fill).toEqual(targetShape3?.fill);
      expect(targetShape?.type).toEqual(targetShape2?.type);
      expect(targetShape?.type).toEqual(targetShape3?.type);
    });

    it('shapes should not leave the canvas', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(3);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['maxHeight'].setValue(200);
      component.roundGeneratorForm.controls['maxWidth'].setValue(200);
      component.roundGeneratorForm.controls['minHeight'].setValue(100);
      component.roundGeneratorForm.controls['minWidth'].setValue(100);
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['circle', 'square']);
      component.roundGeneratorForm.controls['baseShapeTypes'].setValue(['circle', 'rectangle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      rounds.forEach(round => {
        round.objects.forEach(shape => {
          expect(shape.top ?? 0 + (shape.height ?? 0)).toBeLessThanOrEqual(round.canvasHeight);
          expect(shape.left ?? 0 + (shape.width ?? 0)).toBeLessThanOrEqual(round.canvasWidth);
          expect(shape.top).toBeGreaterThanOrEqual(0);
          expect(shape.left).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('shapes should not overlap', () => {
      component.roundGeneratorForm.controls['roundNum'].setValue(3);
      component.roundGeneratorForm.controls['setNum'].setValue(1);
      component.roundGeneratorForm.controls['maxHeight'].setValue(200);
      component.roundGeneratorForm.controls['maxWidth'].setValue(200);
      component.roundGeneratorForm.controls['minHeight'].setValue(100);
      component.roundGeneratorForm.controls['minWidth'].setValue(100);
      component.roundGeneratorForm.controls['targetShapeTypes'].setValue(['circle', 'square']);
      component.roundGeneratorForm.controls['baseShapeTypes'].setValue(['circle', 'rectangle']);
      let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
      rounds.forEach(round => {
        let baseShape = round.objects.find(shape => !shape.target && !shape.distraction);
        let targetShape = round.objects.find(shape => shape.target);
        (baseShape?.top ?? 0) < (targetShape?.top ?? 0) ? expect(baseShape?.top ?? 0 + (baseShape?.height ?? 0)).toBeLessThanOrEqual(targetShape?.top ?? 0) : expect(targetShape?.top ?? 0 + (targetShape?.height ?? 0)).toBeLessThanOrEqual(baseShape?.top ?? 0);
      });
    });

    describe('only shape distraction set', () => {
      beforeEach(() => {
        component.roundGeneratorForm.controls['distractedRoundNum'].setValue(1);
        component.roundGeneratorForm.controls['useShapeDistraction'].setValue(true);
        component.roundGeneratorForm.controls['useBackgroundDistraction'].setValue(false);

        fixture.detectChanges();
      });

      it('each set should have the same number of rounds with shape distraction', () => {
        component.roundGeneratorForm.controls['roundNum'].setValue(2);
        component.roundGeneratorForm.controls['setNum'].setValue(3);
        let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
        let set1roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) <= 2 && round.objects.some(shape => shape.distraction));
        let set2roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) <= 4 && (round.roundIdx ?? 0) > 2 && round.objects.some(shape => shape.distraction));
        let set3roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) > 4 && round.objects.some(shape => shape.distraction));
        expect(set1roundsWithDistraction.length).toEqual(1);
        expect(set2roundsWithDistraction.length).toEqual(1);
        expect(set3roundsWithDistraction.length).toEqual(1);
      });

      it('distracting shape should have the shape type selected in the form', () => {
        component.roundGeneratorForm.controls['roundNum'].setValue(1);
        component.roundGeneratorForm.controls['setNum'].setValue(1);
        component.roundGeneratorForm.controls['distractingShapeConfig'].controls['distractingShapeTypes'].setValue(['circle']);
        let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
        let distractionShape = rounds[0].objects.find(shape => shape.distraction);
        expect(distractionShape?.type).toEqual('circle');
      });
    });

    describe('only background distraction set', () => {
      beforeEach(() => {
        component.roundGeneratorForm.controls['distractedRoundNum'].setValue(1);
        component.roundGeneratorForm.controls['useShapeDistraction'].setValue(false);
        component.roundGeneratorForm.controls['useBackgroundDistraction'].setValue(true);

        fixture.detectChanges();
      });

      it('each set should have the same number of rounds with background distraction', () => {
        component.roundGeneratorForm.controls['roundNum'].setValue(2);
        component.roundGeneratorForm.controls['setNum'].setValue(3);
        let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
        let set1roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) <= 2 && round.backgroundDistraction);
        let set2roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) <= 4 && (round.roundIdx ?? 0) > 2 && round.backgroundDistraction);
        let set3roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) > 4 && round.backgroundDistraction);
        expect(set1roundsWithDistraction.length).toEqual(1);
        expect(set2roundsWithDistraction.length).toEqual(1);
        expect(set3roundsWithDistraction.length).toEqual(1);
      });

      it('distracting background should have the color selected in the form', () => {
        component.roundGeneratorForm.controls['roundNum'].setValue(1);
        component.roundGeneratorForm.controls['setNum'].setValue(1);
        component.roundGeneratorForm.controls['backgroundDistractionConfig'].controls['color'].setValue('#ff0000');
        let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
        expect(rounds[0].backgroundDistraction?.color).toEqual('#ff0000');
      });

      it('background distraction duration should be between the min and max values selected in the form', () => {
        component.roundGeneratorForm.controls['roundNum'].setValue(1);
        component.roundGeneratorForm.controls['setNum'].setValue(1);
        component.roundGeneratorForm.controls['backgroundDistractionConfig'].controls['minDuration'].setValue(1000);
        component.roundGeneratorForm.controls['backgroundDistractionConfig'].controls['maxDuration'].setValue(2000);
        let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
        expect(rounds[0].backgroundDistraction?.duration).toBeGreaterThanOrEqual(1000);
        expect(rounds[0].backgroundDistraction?.duration).toBeLessThanOrEqual(2000);
      });
    });

    describe('both background and shape distraction set', () => {
      beforeEach(() => {
        component.roundGeneratorForm.controls['distractedRoundNum'].setValue(1);
        component.roundGeneratorForm.controls['useShapeDistraction'].setValue(true);
        component.roundGeneratorForm.controls['useBackgroundDistraction'].setValue(true);

        fixture.detectChanges();
      });

      it('each set should have the same number of rounds with some kind of distraction', () => {
        component.roundGeneratorForm.controls['roundNum'].setValue(2);
        component.roundGeneratorForm.controls['setNum'].setValue(3);
        let rounds = component.generateRounds(component.roundGeneratorForm.value as ExperimentConfiguration);
        let set1roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) <= 2 && (round.backgroundDistraction || round.objects.some(shape => shape.distraction)));
        let set2roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) <= 4 && (round.roundIdx ?? 0) > 2 && (round.backgroundDistraction || round.objects.some(shape => shape.distraction)));
        let set3roundsWithDistraction = rounds.filter(round => (round.roundIdx ?? 0) > 4 && (round.backgroundDistraction || round.objects.some(shape => shape.distraction)));
        expect(set1roundsWithDistraction.length).toEqual(1);
        expect(set2roundsWithDistraction.length).toEqual(1);
        expect(set3roundsWithDistraction.length).toEqual(1);
      });
    });

  });

});
