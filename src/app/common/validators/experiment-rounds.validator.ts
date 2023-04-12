import { Injectable }       from '@angular/core';
import { AbstractControl, ValidatorFn }  from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn : 'root'
})
export class ExperimentRoundsValidator
{
  public static conflictingValuesValidator(minControlName: string, maxControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const minControl = formGroup.get(minControlName);
      const maxControl = formGroup.get(maxControlName);

      if (minControl && maxControl && minControl.value > maxControl.value) {
        const errorLabel = `conflictingValues${minControlName}${maxControlName}`;
        const errors: any = {};
        errors[errorLabel] = true;
        return errors;
        //return { conflictingValues: true };
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
}
