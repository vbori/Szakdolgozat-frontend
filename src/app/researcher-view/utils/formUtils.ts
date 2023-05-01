import { FormGroup } from "@angular/forms";

export function markControlsTouched(group: FormGroup): void {
  Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];

      if (abstractControl instanceof FormGroup) {
          markControlsTouched(abstractControl);
      } else {
          abstractControl.markAsTouched();
      }
  });
}