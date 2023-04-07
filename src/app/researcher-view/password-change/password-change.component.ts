import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl, Validators } from '@angular/forms';
import { ResearcherService } from '../services/researcher.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {

  hide = true;

  constructor(private readonly researcherService: ResearcherService) {}


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('newPassword')?.value;
    let confirmPass = group.get('passwordConfirmation')?.value;
    return pass === confirmPass ? null : { notSame: true } //TODO: fix password confirmation
  }

  passwordForm = new FormGroup({
    oldPassword: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    passwordConfirmation: new FormControl<string>('', [Validators.required, this.checkPasswords])
  });

  onChangePassword(): void {
    this.researcherService.changePassword(this.passwordForm.value).subscribe({
      next: (data) => {
        console.log(data.message); //TODO: add messages to the user
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
