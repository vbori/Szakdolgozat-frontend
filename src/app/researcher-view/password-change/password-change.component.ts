import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl, Validators } from '@angular/forms';
import { ResearcherService } from '../services/researcher.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {

  hide = true;

  constructor(private readonly researcherService: ResearcherService, private toastr: ToastrService) {}

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('newPassword')?.value;
    let confirmPass = group.get('passwordConfirmation')?.value;
    return pass === confirmPass ? null : { misMatch: true }
  }

  passwordForm = new FormGroup({
    oldPassword: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    passwordConfirmation: new FormControl<string>('', [Validators.required])
  }, {validators: this.checkPasswords});

  onChangePassword(): void {
    const {oldPassword, newPassword} = this.passwordForm.value;
    if(oldPassword && newPassword)
    this.researcherService.changePassword({oldPassword, newPassword}).subscribe({
      next: (response) => {
        this.toastr.success(response.body?.message, 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
      },
      error: (response) => {
        this.toastr.error(response.error.message, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }
}
