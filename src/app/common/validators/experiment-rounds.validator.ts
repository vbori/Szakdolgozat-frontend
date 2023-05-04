import { Injectable }       from '@angular/core';
import { AbstractControl, ValidatorFn }  from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn : 'root'
})
export class ExperimentRoundsValidator
{
  public static conflictingValuesValidator(minControlName: string, maxControlName: string, minControlSubForm: string | undefined = undefined): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let minControl: AbstractControl | null | undefined;
      const maxControl = formGroup.get(maxControlName);
      if(minControlSubForm) {
        minControl = formGroup.get(minControlSubForm)?.get(minControlName);
      }else{
        minControl = formGroup.get(minControlName);
      }
      if (minControl && maxControl && minControl.value > maxControl.value) {
        const errorLabel = `conflictingValues${minControlSubForm ?? ''}${minControlName}${maxControlName}`;
        const errors: any = {};
        errors[errorLabel] = true;
        return errors;
      }

      return null;
    };
  }

  public static noDistractionSelectedValidator(distractedRoundNumControlName: string, useBackgroundDistractionControlName: string, useShapeDistractionControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const distractedRoundNumControl = formGroup.get(distractedRoundNumControlName);
      const useBackgroundDistractionControl = formGroup.get(useBackgroundDistractionControlName);
      const useShapeDistractionControl = formGroup.get(useShapeDistractionControlName);

      if (distractedRoundNumControl && useBackgroundDistractionControl && useShapeDistractionControl && distractedRoundNumControl.value > 0 && !useBackgroundDistractionControl.value && !useShapeDistractionControl.value) {
        return { noDistractionSelected: true };
      }

      return null;
    }
  }

  public static tooManyTotalRoundsValidator(maxRoundNum: number, roundNumControlName: string, setNumControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const roundNumControl = formGroup.get(roundNumControlName);
      const setNumControl = formGroup.get(setNumControlName);

      if (roundNumControl && setNumControl && roundNumControl.value*setNumControl.value > maxRoundNum) {
        return { tooManyTotalRounds: true };
      }

      return null;
    }
  }

  public static shapesOverlapValidator(canvasWidthControlName: string, normalMinWidthControlName: string, distractionMinWidthControlName: string, useShapeDistractionControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const canvasWidth = formGroup.get(canvasWidthControlName)?.value;
      const normalMinWidth = formGroup.get(normalMinWidthControlName)?.value;
      const distractionMinWidth = formGroup.get(distractionMinWidthControlName)?.value;

      if (canvasWidth && normalMinWidth) {
        if(formGroup.get(useShapeDistractionControlName)?.value) {
          if(2*normalMinWidth + distractionMinWidth > canvasWidth) {
            return { shapesOverlapWithDistraction: true };
          }
        }else if(2*normalMinWidth > canvasWidth){
          return { shapesOverlap: true };
        }
      }

      return null;
    }
  }
}
